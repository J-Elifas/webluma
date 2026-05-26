# Repository Guidelines

## Scope

- Treat this file as repo-wide guidance for every Codex session.
- Keep instructions reusable. Do not add one-off task notes, feature plans, or temporary implementation details.
- Use `SPEC.md` as the source of truth for product requirements, current scope, UX expectations, and acceptance criteria.
- Validate product-facing changes against `SPEC.md` when the change touches requirements, behavior, or UX.

## Project Structure

This is a Next.js App Router project using TypeScript and Tailwind v4.

- `src/app/`: Route tree, layouts, loading/error UI, page entry points, and route-local controllers.
- `src/components/`: Reusable presentation components for app shell, auth, dashboard, layout, and UI primitives.
- `src/server/`: Server-only auth, database, and feature data modules.
- `public/`: Static assets served directly.
- Root config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and `postcss.config.mjs`.
- Product requirements/spec: `SPEC.md`.

Keep route-level orchestration in `src/app/`. Place shared presentation, controls, and layout building blocks in `src/components/`.

Files inside `src/components/` must be presentational only. Do not put data fetching, routing decisions, auth calls, form submission logic, validation logic, or feature workflows there. Place behavior in route controllers, server modules, or other route-owned files, then pass data, callbacks, and display state into components as props.

Keep server-only feature code in `src/server/<feature>/`:

- `queries.ts`: read data.
- `mutations.ts`: create, update, and delete data.
- `types.ts`: shared TypeScript shapes when needed.

## Coding Standards

- Use TypeScript for application code (`.ts` / `.tsx`).
- Use 4-space indentation and keep components focused.
- All React component files must use PascalCase, for example `LoginForm.tsx`, `LoginCard.tsx`, `IllustrationPanel.tsx`, and `DashboardContent.tsx`.
- All React component function/export names must use PascalCase and should match the file name.
- Use App Router conventions for routes (`page.tsx`, `layout.tsx`, route groups, and dynamic segments like `[id]`).
- Use conventional server module names such as `queries.ts`, `mutations.ts`, `types.ts`, `options.ts`, and `password.ts`.
- Use kebab-case for general utilities when a convention-specific name does not apply.
- Prefer Server Components by default. Add `"use client"` only when browser APIs, React state, effects, or event handlers are required.
- Keep reusable logic and presentation independent of a single route unless the code is genuinely route-specific.
- Follow existing Tailwind v4 patterns and avoid introducing new styling systems without a clear repo-wide need.

## Product Direction

- Webluma is the primary app brand.
- ClientFlow is the current protected workspace concept described in `SPEC.md`.
- The dashboard uses mock data only until the spec defines real CRUD or Prisma-backed dashboard data.
- `/clients` and `/billing` remain placeholders until their product workflows are specified.

## UI/UX Standards

- Match the existing visual language before introducing new patterns.
- Build responsive, mobile-first layouts that also work across desktop widths.
- Use semantic HTML, accessible labels, keyboard-friendly controls, visible focus states, and meaningful alt text for informative images.
- Account for common UI states: loading, empty, error, disabled, hover, and active states when relevant.
- Keep interface copy concise and user-facing errors generic.
- For UI changes, verify text wrapping, spacing, and overlap behavior in the affected viewports.

## Commands

Check `package.json` before changing documented commands. Current scripts include:

- `npm run dev`: Start the Next.js dev server.
- `npm run build`: Create a production build.
- `npm run start`: Run the production server.
- `npm run lint`: Run ESLint.
- `npm test`: Run Vitest in watch mode.
- `npm run test:run`: Run Vitest once.
- `npm run format:check`: Check Prettier formatting.
- `npm run format`: Format files with Prettier.
- `npm run e2e`: Build and run Playwright tests.

Use `npx tsc --noEmit` for TypeScript checking unless a dedicated npm script is added.

## Verification Workflow

- After code changes, run `npm run lint` and `npx tsc --noEmit`; fix any errors before finishing.
- Run `npm run test:run` when changing logic, state management, or tested behavior.
- Run `npm run build` when changing routing, server/client component boundaries, config, or build-sensitive code.
- Run relevant Playwright checks for user-facing flow changes where browser behavior matters.
- For docs-only changes, state which checks were skipped and why.

## Performance Guidance

- Remove unnecessary `"use client"` directives.
- Move data fetching from `useEffect` to Server Components where possible.
- Do not call local API routes from Server Components; import server modules directly.
- Cache stable data with `revalidate`, `unstable_cache`, or fetch caching when appropriate.
- Lazy-load heavy Client Components when they are not needed for initial interaction.
- Watch bundle size before adding dependencies.
- Remove or replace heavy dependencies when a lighter local pattern is sufficient.
- Optimize third-party scripts.

## Security

- Do not commit secrets, tokens, credentials, or private environment values.
- Use environment variables for sensitive configuration.
- Do not expose server-only values to client components.
- Validate and sanitize external input at trust boundaries.

## Commit And Pull Request Guidance

- Keep commits scoped to one logical change with a short, verb-first subject.
- PR notes should summarize what changed, why it changed, relevant `SPEC.md` sections when applicable, UI screenshots or GIFs for visual changes, and verification commands run.
