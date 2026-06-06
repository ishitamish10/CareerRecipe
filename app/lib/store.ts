import { TableClient, type TableEntity } from "@azure/data-tables";
import type { Comment, Roadmap, RoadmapInput, User } from "./types";
import { SAMPLE_ROADMAPS } from "./sample-data";

/**
 * Data access layer for CareerRecipe.
 *
 * Backend selection:
 *   - If AZURE_STORAGE_CONNECTION_STRING is set, recipes/votes/comments are
 *     persisted to Azure Table Storage (the "database" of Azure Storage).
 *   - Otherwise an in-memory store (seeded with sample recipes) is used so the
 *     app runs with zero configuration for local dev and previews.
 *
 * Every exported function returns the same shapes regardless of backend.
 */

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const PREFIX = process.env.AZURE_TABLE_PREFIX || "careerrecipe";
const ROADMAP_PARTITION = "roadmap";

export const usingAzure = Boolean(CONNECTION_STRING);

function genId(): string {
  return globalThis.crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// Azure Table Storage backend
// ---------------------------------------------------------------------------

type RoadmapEntity = TableEntity<Omit<Roadmap, "id">>;
type CommentEntity = TableEntity<Omit<Comment, "id" | "roadmapId">>;
type UserEntity = TableEntity<Omit<User, "id">>;

const USER_PARTITION = "user";

let roadmapTablePromise: Promise<TableClient> | null = null;
let commentTablePromise: Promise<TableClient> | null = null;
let userTablePromise: Promise<TableClient> | null = null;

function tableClient(name: string): Promise<TableClient> {
  const client = TableClient.fromConnectionString(CONNECTION_STRING!, name, {
    allowInsecureConnection: CONNECTION_STRING!.includes("UseDevelopmentStorage"),
  });
  return client.createTable().then(
    () => client,
    // 409 = table already exists; anything else is a real error.
    (err: { statusCode?: number }) => {
      if (err?.statusCode === 409) return client;
      throw err;
    },
  );
}

function roadmapTable(): Promise<TableClient> {
  roadmapTablePromise ??= tableClient(`${PREFIX}roadmaps`);
  return roadmapTablePromise;
}

function commentTable(): Promise<TableClient> {
  commentTablePromise ??= tableClient(`${PREFIX}comments`);
  return commentTablePromise;
}

function userTable(): Promise<TableClient> {
  userTablePromise ??= tableClient(`${PREFIX}users`);
  return userTablePromise;
}

function entityToRoadmap(e: RoadmapEntity): Roadmap {
  return {
    id: e.rowKey as string,
    title: e.title,
    field: e.field,
    duration: e.duration,
    description: e.description,
    successes: e.successes,
    challenges: e.challenges,
    lessons: e.lessons,
    tips: e.tips,
    createdAt: e.createdAt,
    helpful: e.helpful ?? 0,
    commentsCount: e.commentsCount ?? 0,
    authorId: e.authorId || undefined,
    authorName: e.authorName || undefined,
  };
}

function entityToUser(e: UserEntity): User {
  return {
    id: e.rowKey as string,
    name: e.name,
    email: e.email,
    role: e.role,
    passwordHash: e.passwordHash,
    createdAt: e.createdAt,
  };
}

// ---------------------------------------------------------------------------
// In-memory backend (dev / preview)
// ---------------------------------------------------------------------------

interface MemoryStore {
  roadmaps: Roadmap[];
  comments: Comment[];
  users: User[];
}

// Persist across Next.js hot reloads in development.
const g = globalThis as typeof globalThis & { __crStore?: MemoryStore };
function memory(): MemoryStore {
  g.__crStore ??= { roadmaps: [...SAMPLE_ROADMAPS], comments: [], users: [] };
  return g.__crStore;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function listRoadmaps(): Promise<Roadmap[]> {
  if (!usingAzure) {
    return [...memory().roadmaps].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const table = await roadmapTable();
  const out: Roadmap[] = [];
  for await (const e of table.listEntities<Omit<Roadmap, "id">>()) {
    out.push(entityToRoadmap(e as RoadmapEntity));
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getRoadmap(id: string): Promise<Roadmap | null> {
  if (!usingAzure) {
    return memory().roadmaps.find((r) => r.id === id) ?? null;
  }
  try {
    const table = await roadmapTable();
    const e = await table.getEntity<Omit<Roadmap, "id">>(ROADMAP_PARTITION, id);
    return entityToRoadmap(e as RoadmapEntity);
  } catch (err) {
    if ((err as { statusCode?: number })?.statusCode === 404) return null;
    throw err;
  }
}

export async function searchRoadmaps(query: string): Promise<Roadmap[]> {
  const q = query.trim().toLowerCase();
  const all = await listRoadmaps();
  if (!q) return all;
  return all.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.field.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q),
  );
}

export async function createRoadmap(input: RoadmapInput): Promise<Roadmap> {
  const roadmap: Roadmap = {
    id: genId(),
    ...input,
    createdAt: new Date().toISOString(),
    helpful: 0,
    commentsCount: 0,
  };

  if (!usingAzure) {
    memory().roadmaps.unshift(roadmap);
    return roadmap;
  }

  const table = await roadmapTable();
  const { id, authorId, authorName, ...rest } = roadmap;
  await table.createEntity({
    partitionKey: ROADMAP_PARTITION,
    rowKey: id,
    ...rest,
    // Azure Tables rejects undefined values — only include authors when set.
    ...(authorId ? { authorId } : {}),
    ...(authorName ? { authorName } : {}),
  });
  return roadmap;
}

export async function markHelpful(id: string): Promise<number | null> {
  if (!usingAzure) {
    const r = memory().roadmaps.find((x) => x.id === id);
    if (!r) return null;
    r.helpful += 1;
    return r.helpful;
  }

  const table = await roadmapTable();
  try {
    const e = await table.getEntity<Omit<Roadmap, "id">>(ROADMAP_PARTITION, id);
    const helpful = (e.helpful ?? 0) + 1;
    await table.updateEntity(
      { partitionKey: ROADMAP_PARTITION, rowKey: id, helpful },
      "Merge",
    );
    return helpful;
  } catch (err) {
    if ((err as { statusCode?: number })?.statusCode === 404) return null;
    throw err;
  }
}

export async function listComments(roadmapId: string): Promise<Comment[]> {
  if (!usingAzure) {
    return memory()
      .comments.filter((c) => c.roadmapId === roadmapId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const table = await commentTable();
  const out: Comment[] = [];
  const iter = table.listEntities<Omit<Comment, "id" | "roadmapId">>({
    queryOptions: { filter: `PartitionKey eq '${roadmapId.replace(/'/g, "''")}'` },
  });
  for await (const e of iter) {
    out.push({
      id: e.rowKey as string,
      roadmapId,
      author: e.author,
      content: e.content,
      createdAt: e.createdAt,
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addComment(
  roadmapId: string,
  author: string,
  content: string,
): Promise<Comment | null> {
  const roadmap = await getRoadmap(roadmapId);
  if (!roadmap) return null;

  const comment: Comment = {
    id: genId(),
    roadmapId,
    author: author.trim() || "Anonymous",
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  if (!usingAzure) {
    const mem = memory();
    mem.comments.push(comment);
    const r = mem.roadmaps.find((x) => x.id === roadmapId);
    if (r) r.commentsCount += 1;
    return comment;
  }

  const cTable = await commentTable();
  await cTable.createEntity<CommentEntity>({
    partitionKey: roadmapId,
    rowKey: comment.id,
    author: comment.author,
    content: comment.content,
    createdAt: comment.createdAt,
  });

  const rTable = await roadmapTable();
  await rTable.updateEntity(
    {
      partitionKey: ROADMAP_PARTITION,
      rowKey: roadmapId,
      commentsCount: roadmap.commentsCount + 1,
    },
    "Merge",
  );
  return comment;
}

/** Idempotently load the sample recipes into the active backend. */
export async function seed(): Promise<{ inserted: number }> {
  if (!usingAzure) {
    const mem = memory();
    let inserted = 0;
    for (const r of SAMPLE_ROADMAPS) {
      if (!mem.roadmaps.some((x) => x.id === r.id)) {
        mem.roadmaps.push({ ...r });
        inserted++;
      }
    }
    return { inserted };
  }

  const table = await roadmapTable();
  let inserted = 0;
  for (const r of SAMPLE_ROADMAPS) {
    const { id, ...rest } = r;
    try {
      await table.createEntity<Omit<Roadmap, "id">>({
        partitionKey: ROADMAP_PARTITION,
        rowKey: id,
        ...rest,
      });
      inserted++;
    } catch (err) {
      if ((err as { statusCode?: number })?.statusCode !== 409) throw err;
    }
  }
  return { inserted };
}

// ---------------------------------------------------------------------------
// Users / accounts
// ---------------------------------------------------------------------------

export async function getUserByEmail(email: string): Promise<User | null> {
  const normalized = email.trim().toLowerCase();
  if (!usingAzure) {
    return memory().users.find((u) => u.email === normalized) ?? null;
  }
  const table = await userTable();
  const iter = table.listEntities<Omit<User, "id">>({
    queryOptions: { filter: `email eq '${normalized.replace(/'/g, "''")}'` },
  });
  for await (const e of iter) {
    return entityToUser(e as UserEntity);
  }
  return null;
}

export async function getUserById(id: string): Promise<User | null> {
  if (!usingAzure) {
    return memory().users.find((u) => u.id === id) ?? null;
  }
  try {
    const table = await userTable();
    const e = await table.getEntity<Omit<User, "id">>(USER_PARTITION, id);
    return entityToUser(e as UserEntity);
  } catch (err) {
    if ((err as { statusCode?: number })?.statusCode === 404) return null;
    throw err;
  }
}

export async function createUser(input: {
  name: string;
  email: string;
  role: User["role"];
  passwordHash: string;
}): Promise<User> {
  const user: User = {
    id: genId(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };

  if (!usingAzure) {
    memory().users.push(user);
    return user;
  }

  const table = await userTable();
  const { id, ...rest } = user;
  await table.createEntity<Omit<User, "id">>({
    partitionKey: USER_PARTITION,
    rowKey: id,
    ...rest,
  });
  return user;
}
