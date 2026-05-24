# Repository Guidelines

## Scope

- Treat this file as repo-wide guidance for every Codex session.
- Keep instructions reusable. Do not add one-off task notes, feature plans, or temporary implementation details.
- Validate product-facing changes against `SPEC.md` when the change touches requirements, behavior, or UX.

## Project Structure

This is a Next.js App Router project using TypeScript and Tailwind v4.

- `src/app/`: Route tree, layouts, loading/error UI, and page entry points.
- `src/components/`: Reusable UI, layout, and presentation components.
- `public/`: Static assets served directly.
- Root config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and `postcss.config.mjs`.
- Product requirements/spec: `SPEC.md`.

Keep route-level orchestration in `src/app/`. Move shared presentation, controls, and layout building blocks to `src/components/`.
Files inside `src/components/` must be presentational only: do not put state management, data fetching, routing decisions, auth calls, form submission logic, validation logic, or other behavior there. Place all feature logic and behavior in `src/app/` route, page, layout, or route-local controller files, then pass the resulting data, callbacks, and display state into components as props.

## Coding Standards

- Use TypeScript for application code (`.ts` / `.tsx`).
- Use 4-space indentation and keep components focused.
- All React component files must use PascalCase, for example `LoginForm.tsx`, `LoginCard.tsx`, `IllustrationPanel.tsx`, and `PlaceholderPage.tsx`.
- All React component function/export names must use PascalCase and should match the file name.
- Use kebab-case file names for utilities, for example `placeholder-page.tsx`.
- Follow App Router conventions for routes (`page.tsx`, `layout.tsx`, route groups, and dynamic segments like `[id]`).
- Prefer server components by default. Add `"use client"` only when browser APIs, React state, effects, or event handlers are required.
- Keep reusable logic and presentation independent of a single route unless the code is genuinely route-specific.
- Follow existing Tailwind v4 patterns and avoid introducing new styling systems without a clear repo-wide need.

## UI/UX Standards

- Match the existing visual language before introducing new patterns.
- Build responsive layouts that work across mobile and desktop widths.
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

## Security

- Do not commit secrets, tokens, credentials, or private environment values.
- Use environment variables for sensitive configuration.
- Do not expose server-only values to client components.
- Validate and sanitize external input at trust boundaries.

## Commit and Pull Request Guidance

- Keep commits scoped to one logical change with a short, verb-first subject.
- PR notes should summarize what changed, why it changed, relevant `SPEC.md` sections when applicable, UI screenshots or GIFs for visual changes, and verification commands run.
