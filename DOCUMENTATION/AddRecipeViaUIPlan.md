# "Adaugă Rețetă" — Protected Add Recipe Page (Chefs Only)

Goal: Build a single-submit form page that mirrors Strapi Recipe creation (fields/components/relations) and writes a new Recipe entry visible in Strapi Admin. Access restricted to “chefs” authenticated via Access Gate cookie token.

---

## ✅ Scope & Constraints

- Access control: Only users with valid Access Gate token (role=chef) can use this page.
- Strapi parity: Form supports all fields from Strapi Recipe spec (see DOCUMENTATION/StrapiConfigurationGuide.md).
- Single submit: One `multipart/form-data` POST handles data + file uploads together.
- Persistence: Entry is created inside Strapi using internal services; visible in Admin as a normal Recipe.
- Files: Cover image (single), gallery images (multi), optional instruction step images are supported.

---

## 🔐 Access Control & Auth Strategy

- Extend Access Gate token payload to include `role: "chef"` (or treat all holders as chefs).
- Verify `access_token` (HttpOnly cookie) server-side before create.
- Reject with 401 if missing/invalid; 403 if role != chef.

---

## 🧱 Data Model Mapping (from StrapiConfigurationGuide)

Recipe fields (create):

- Basic: `title` (required), `slug` (UID from title), `description` (required)
- Media: `coverImage` (required, single), `galleryImages` (optional, multi)
- Components (repeatable):
  - `ingredients`: array of `{ item (req), quantity (req), unit (opt), notes (opt) }`
  - `instructions`: array of `{ stepNumber (req), description (req), image (opt), tips (opt) }`
- Numbers: `prepTime` (req, int), `cookTime` (req, int), `servings` (req, int>=1)
- Enum: `difficulty` (req: Easy|Medium|Hard)
- Relation: `categories` (many-to-many; input via IDs or slugs)
- JSON: `tags` (array of strings)

---

## 🔧 Root-Level Proxy Service (no backend changes)

- Files (root only):

  - `server/recipes-proxy.ts` (or `server/index.ts`)
  - Root `package.json` scripts to run proxy with frontend

- Route (proxy):

  - `POST /proxy/recipes/create` — receives a single `multipart/form-data` submit
  - Auth: Verify Access Gate cookie (`access_token`) using `JWT_SECRET`; 403 if not chef
  - Content-Type parts:
    - `data`: JSON string matching recipe schema (no files inside)
    - `coverImage`: single file
    - `galleryImages`: multiple files
    - `instructionImages[index]`: optional files mapped to `instructions[index].image`

- Proxy orchestration (Strapi REST):

  1. Parse `data` JSON; validate required fields
  2. Resolve category slugs → IDs via Strapi REST (or accept IDs directly)
  3. Create recipe: `POST ${STRAPI_URL}/api/recipes` with `data` (Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`)
  4. Upload files: `POST ${STRAPI_URL}/api/upload` with `ref=api::recipe.recipe`, `refId=<id>`, `field=...`
     - Cover: `field=coverImage`
     - Gallery: `field=galleryImages` (multiple files)
     - Instruction images: per-step upload; update recipe with linked media (nested path if supported)
  5. Return `{ ok: true, id, slug }`

- Environment (root `.env`):

  - `STRAPI_URL` (e.g., http://localhost:1337)
  - `STRAPI_ADMIN_TOKEN` (scoped token: create/upload permissions)
  - `JWT_SECRET` (verify Access Gate cookie)
  - Optional: `ENABLE_ADD_RECIPE_PAGE=true`

- Security & rate limits (proxy):
  - Rate limit per IP on `/proxy/recipes/create`
  - Do not expose `STRAPI_ADMIN_TOKEN` to browser
  - Log failures without sensitive data

---

## 🖥️ Frontend Implementation (React page → Root Proxy)

- Files:

  - frontend: `src/pages/AddRecipe.tsx`
  - frontend helpers: `src/lib/utils.ts` (form helpers), `src/lib/strapi.ts` (optional client wrapper)

- Page access:

  - On mount, call `GET /access/me`; redirect to `/access` if 401/403.

- Form sections:

  1. Basic info: `title`, `description` (auto-generate `slug` client-side; server still validates)
  2. Times & servings: `prepTime`, `cookTime`, `servings`, `difficulty`
  3. Categories: multi-select by name/slug (load from Strapi)
  4. Ingredients: repeatable rows with add/remove
  5. Instructions: repeatable rows with add/remove + optional image per step
  6. Media: `coverImage` (single file), `galleryImages` (multi files)
  7. Tags: comma-separated → array

- Submit:

  - Build `FormData`:
    - `data` = JSON.stringify({ ...mapped fields... })
    - append files accordingly
  - POST to proxy `POST /proxy/recipes/create`
  - On success: show toast + navigate to recipe detail `/recipe/:slug` or admin link.

- UX details:
  - Client-side validation + inline errors
  - Preview selected images
  - Disable submit while uploading; show progress
  - Prevent accidental navigation away; confirm dialog if dirty

---

## ✅ Validation Rules (client + server)

- Required: `title`, `description`, `prepTime`, `cookTime`, `servings`, `difficulty`, `ingredients[...].item`, `ingredients[...].quantity`, `instructions[...].stepNumber`, `instructions[...].description`, `coverImage`.
- Ranges: `servings >= 1`, `prepTime >= 0`, `cookTime >= 0`.
- Enumerations: `difficulty ∈ {Easy, Medium, Hard}`.
- Slug: generated from title; server ensures uniqueness (fallback: add numeric suffix).
- Tags: sanitized array of strings.

---

## 🔄 Data & Files Mapping

- Categories:

  - Option A: frontend fetches categories; submit IDs.
  - Option B: submit slugs; server resolves to IDs via `strapi.entityService.findMany('api::category.category', { filters: { slug: { $in: slugs } } })`.

- Files:
  - `coverImage`: single file → Upload plugin → relation in `recipe.coverImage`.
  - `galleryImages`: multiple files → many relations.
  - `instructions`: optional per-step image → relation on each component item.

---

## 🧪 Testing Plan (Playwright)

- File: `playwright/tests/addRecipe.spec.ts`
- Scenarios:
  - Access control: unauthenticated redirected to `/access`.
  - Form load: all sections render.
  - Validation: missing required fields shows errors; disabled submit.
  - Successful create: fill all fields, upload files, submit; expect success toast + redirect; verify record exists via API.
  - Media: cover + gallery images uploaded and appear in Strapi response.
  - Instructions images: optional; if added, appear under `instructions[i].image`.

---

## 🚀 Rollout & Docs

- Feature flag: optional `ENABLE_ADD_RECIPE_PAGE` env to toggle route.
- Docs: Link this plan from `DOCUMENTATION/DevelopmentPlan.md` and Access Gate Plan.
- Monitoring: log errors server-side; add simple metrics for create attempts.

---

## 📋 Step-by-Step Implementation Tasks

1. ✅ Define goals & constraints (no backend changes)
2. ❌ Implement root proxy service (`server/recipes-proxy.ts`) with Access Gate verification
3. ❌ Orchestrate Strapi REST calls (create + upload) inside proxy
4. ❌ Build `src/pages/AddRecipe.tsx` with all sections and repeatables
5. ❌ Client-side validation + UX (errors, previews, progress)
6. ❌ Wire submit to proxy; success redirect; error handling
7. ❌ Write Playwright test `playwright/tests/addRecipe.spec.ts`
8. ❌ Update `DOCUMENTATION/DevelopmentPlan.md` with links & checklist entries

---

## 🔤 Naming & Routing Convention

- Use English naming for files and routes related to this feature to simplify local vs production deployments and avoid locale-specific paths.
- Page file: `src/pages/AddRecipe.tsx`
- Route path: `/add-recipe`
- Test file: `playwright/tests/addRecipe.spec.ts`

---

## 🔗 References

- DOCUMENTATION/StrapiConfigurationGuide.md (fields & structure)
- DOCUMENTATION/AccessGatePlan.md (access gate details)
- Strapi docs: entityService, upload plugin, controllers, routes
