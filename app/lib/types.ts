/** Two account types: students explore careers, professionals post recipes. */
export type Role = "student" | "professional";

export interface User {
  id: string;
  name: string;
  email: string; // stored lowercased
  role: Role;
  passwordHash: string;
  createdAt: string;
}

/** User shape safe to send to the client (no password hash). */
export type PublicUser = Pick<User, "id" | "name" | "email" | "role">;

export interface Roadmap {
  id: string;
  title: string;
  field: string;
  duration: string;
  description: string;
  successes: string;
  challenges: string;
  lessons: string;
  tips: string;
  createdAt: string; // ISO timestamp
  helpful: number;
  commentsCount: number;
  authorId?: string;
  authorName?: string;
}

export interface Comment {
  id: string;
  roadmapId: string;
  author: string;
  content: string;
  createdAt: string;
}

/** Payload accepted by POST /api/roadmaps */
export type RoadmapInput = Omit<
  Roadmap,
  "id" | "createdAt" | "helpful" | "commentsCount"
>;
