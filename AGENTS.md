# AGENTS.md - Retete pentru Iepurasi 🍽️🐰

This file provides essential guidelines for agentic coding tools working in this repository. It contains build commands, code style conventions, testing patterns, and operational procedures.

## 🚀 Build, Lint, and Test Commands

### Development Commands
- `npm run dev` - Start Vite development server (typically runs on http://localhost:5173)
- `npm run build` - Build production bundle with Vite
- `npm run build:dev` - Build development bundle
- `npm run preview` - Preview production build locally
- `npm run start` - Alias for preview command

### Code Quality Commands
- `npm run lint` - Run ESLint on all source files
- `npm run ci` - Run linting and build (CI pipeline)

### Testing Commands
- `npm run test` - Run all Playwright E2E tests
- Run single test file: `cd playwright && npx playwright test tests/homePage.spec.ts`
- Run specific test: `cd playwright && npx playwright test --grep "home page search"`
- Run tests in specific browser: `cd playwright && npx playwright test --project chromium`
- Debug tests: `cd playwright && npx playwright test --debug`

## 📝 Code Style Guidelines

### TypeScript Configuration
- **Strict mode**: Disabled (`strict: false`, `noImplicitAny: false`)
- **Unused variables**: Allowed (`noUnusedLocals: false`, `noUnusedParameters: false`)
- **Path aliases**: Use `@/` for `src/` imports (e.g., `import { Recipe } from "@/lib/types"`)
- **JSX**: React JSX transform (`jsx: "react-jsx"`)

### Import Organization
- Group imports by type: React/third-party, local components, utilities, types
- Use absolute imports with `@/` alias for src directory
- Alphabetize imports within groups when possible

```typescript
// Good import organization
import React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types";
import { cn } from "@/lib/utils";
```

### Naming Conventions
- **Components**: PascalCase (e.g., `RecipeCard`, `SearchBar`)
- **Hooks**: camelCase with `use` prefix (e.g., `useToast`, `useMobile`)
- **Types**: PascalCase interfaces, camelCase type aliases
- **Files**: kebab-case for components/hooks, camelCase for utilities
- **Test IDs**: camelCase constants (e.g., `searchBarInput`, `recipeGrid`)

### Component Patterns
- Use functional components with TypeScript interfaces for props
- Include `data-testid` attributes for all interactive elements
- Use `cn()` utility for conditional className merging
- Prefer explicit prop types over implicit any

```typescript
interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  className?: string;
}

export function RecipeCard({ recipe, onClick, className }: RecipeCardProps) {
  return (
    <article
      onClick={onClick}
      data-testid={`recipe-card-${recipe.id}`}
      className={cn("bg-card rounded-xl", className)}
    >
      {/* Component content */}
    </article>
  );
}
```

### Styling Conventions
- **CSS Framework**: Tailwind CSS with custom design system
- **Component Library**: Shadcn/ui with custom variants
- **Class Merging**: Use `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- **Responsive Design**: Mobile-first approach with responsive utilities

### Error Handling
- Use try-catch blocks for async operations
- Provide meaningful error messages to users
- Log errors with context (request path, error cause)
- Avoid exposing sensitive information in error messages

## 🧪 Testing Conventions

### Playwright E2E Tests
- **Test Location**: `playwright/tests/` directory
- **Configuration**: `playwright/playwright.config.ts`
- **Test Structure**: Define `data-testid` constants at file top, then use `page.getByTestId()`

```typescript
// Test ID constants (camelCase)
const searchBarInput = "search-bar-input";
const recipeGrid = "recipe-grid";

test("home page search", async ({ page }) => {
  await page.goto("/");

  const searchInput = page.getByTestId(searchBarInput);
  await expect(searchInput).toBeVisible();

  await searchInput.fill("pizza");
  await expect(page.getByTestId(recipeGrid)).toBeVisible();
});
```

### Test Best Practices
- **Deterministic Tests**: Use `beforeEach` to clear localStorage or reset state
- **Data Attributes**: All interactive elements must have `data-testid` attributes
- **Test ID Naming**: Follow component naming with descriptive suffixes
- **Mocking**: Use `page.route()` for API mocking when needed
- **Assertions**: Prefer semantic assertions over implementation details

## 🔧 Operational Guidelines

### Environment Variables
- **Frontend**: Use `VITE_` prefix for client-side variables
- **Backend**: Strapi backend expects standard env vars (DATABASE_URL, etc.)
- **Security**: Never commit `.env` files or secrets to repository
- **Build-time**: Vite inlines `VITE_` variables at build time

### API Integration
- **Backend**: Strapi CMS (content management system)
- **Client Library**: Centralized in `src/lib/strapi.ts`
- **Fallback**: App falls back to `src/lib/sample-recipes.ts` when backend unavailable
- **Mapping**: Use helper functions for API response transformation

### Git Workflow
- **Commits**: Follow conventional commit format when possible
- **Branches**: Feature branches for new work
- **Pre-commit**: ESLint runs automatically (if configured)

## 📋 Copilot Rules Integration

### High-level Rules ✅
- Prefer **small, focused changes** and include a short plan in `DOCUMENTATION/` before large work
- Never suggest committing secrets or `.env` contents into the repo
- When suggesting code that changes behavior in production, include verification steps

### Frontend Conventions (src/)
- Codebase uses **TypeScript + React (Vite)** - always type new modules and exports
- When suggesting UI changes, add `data-testid="..."` attributes to elements for Playwright tests
- Update `src/lib/strapi.ts` when API contract or URL handling changes
- For build-time env vars: `VITE_` variables are inlined at build time

### Testing Conventions (Playwright)
- E2E tests live under `playwright/tests/` with clear structure
- Define `data-testid` constants at top of spec files and reuse them across tests
- `data-testid` values should be in camelCase and independent (not in objects/structures)
- Keep tests deterministic: use `beforeEach` to clear localStorage or set initial state

### Documentation-first Workflow
- Before non-trivial work, create/update a plan in `DOCUMENTATION/` (one-page checklist)
- Update `DOCUMENTATION/troubleshooting.md` and `README.md` for usage/deployment changes
- Add verification checklists to plans (commands, expected HTTP status codes, log paths)

### Developer Experience
- Prefer clear, small helper functions and centralize network/serialization logic
- Keep components small and testable; favor explicit prop types
- All code is written in English, but user-facing text (UI, docs) is in Romanian
- No need to use special Romanian characters (ă, ș, ț) in user-facing text

## 🚨 Common Issues & Solutions

### Build Issues
- **Vite not starting**: Check Node.js version (18+ required)
- **TypeScript errors**: Verify import paths and type definitions
- **Environment variables**: Ensure `VITE_` prefix for client-side vars

### Testing Issues
- **Tests failing**: Check if dev server is running on expected port
- **Data-testid not found**: Verify component has correct test attributes
- **Flaky tests**: Add proper waits and ensure deterministic state

### API Issues
- **Backend unreachable**: App falls back to sample data automatically
- **CORS errors**: Configure Strapi CORS settings for frontend origin
- **Authentication**: Public endpoints should allow `find` and `findOne` permissions

## 📚 Additional Resources

- **README.md**: Complete setup and deployment instructions
- **development-plan.md**: Implementation plan and backend content types
- **.github/copilot-instructions.md**: Detailed Copilot guidance (source of many rules above)
- **Strapi Documentation**: For backend API understanding</content>
<parameter name="filePath">/home/adi/Desktop/code/retete-martioli/AGENTS.md