# CareerRecipe — Web App (Next.js + Azure Storage)

The modern web app lives in this repo as a **Next.js 15 (App Router)** project.
The backend is a set of API route handlers backed by **Azure Table Storage**
(the "database" inside an Azure Storage account), with a zero-config in-memory
fallback so it runs instantly during development.

> Note: this is a *server-rendered* Next.js app, not a pure static export.
> A full static export (`output: 'export'`) cannot host the `/api` routes that
> talk to Azure Storage. Deploy it to **Azure App Service** or **Azure Static
> Web Apps** (hybrid/Next.js preset), both of which run the Node server.

The entire web app lives in the repo's `app/` directory — run all commands from
there. The legacy Flask prototype stays at the repo root.

## Quick start

```bash
cd app
npm install
npm run dev        # http://localhost:3000
```

With no environment variables set, the app serves seeded sample recipes from an
in-memory store — perfect for previewing the UI.

## Project structure

```
app/
  layout.tsx            # root layout, fonts, theme provider, nav/footer
  page.tsx              # home (hero, categories, featured recipes)
  explore/              # searchable/filterable recipe browser (client)
  recipe/[id]/          # recipe detail (server) + helpful + comments (client)
  create/               # "share a recipe" form (client)
  api/                  # route handlers (the backend)
    roadmaps/           # GET list, POST create
    roadmaps/[id]/      # GET one, /helpful (POST), /comments (GET, POST)
    search/             # GET ?q=
    seed/               # POST — load sample data into the active backend
components/             # Navbar, Footer, ThemeToggle, RecipeCard, ...
lib/
  store.ts             # data layer: Azure Table Storage + in-memory fallback
  types.ts             # Roadmap / Comment / RoadmapInput
  categories.ts        # career fields + accents
  sample-data.ts       # seed recipes
public/images/         # career artwork
```

## Connecting Azure Storage

1. Create an Azure Storage account (Standard, general-purpose v2).
2. Copy a connection string from **Access keys**.
3. Set it before running:

   ```bash
   # .env.local
   AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
   # optional table-name prefix (default: careerrecipe)
   AZURE_TABLE_PREFIX=careerrecipe
   ```

4. (Optional) Seed the sample recipes once the account is connected:

   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

The app creates the tables (`<prefix>roadmaps`, `<prefix>comments`) on first
use. For local Azure emulation, install **Azurite** and use
`AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true`.

## Theming

Light/dark theming uses `next-themes` (class strategy) wired to Tailwind v4's
`dark:` variant. Semantic color tokens (`--primary`, `--surface`, `--muted`, …)
are defined in [app/globals.css](app/globals.css) and swap per theme; the toggle
lives in [components/ThemeToggle.tsx](components/ThemeToggle.tsx).

## Deploying to Azure

- **Azure Static Web Apps** (recommended): use the Next.js preset; SWA runs the
  hybrid Next.js server and managed functions. Add
  `AZURE_STORAGE_CONNECTION_STRING` under *Configuration*.
- **Azure App Service (Node)**: `npm run build` then `npm run start`; set the
  same app setting. App Service supplies `PORT` automatically.

## Legacy Flask app

The original `app.py` / `templates/` / `static/` Flask prototype is kept for
reference. It is independent of the Next.js app and is not used at runtime.
```
