# Webluma Product Spec

## Overview

Webluma is a SaaS web app built with Next.js App Router, TypeScript, npm, and Tailwind CSS v4.

The project establishes a production route structure, a polished authentication entry page, and protected application routes. Authentication must be implemented in a way that can connect to real email/password submission, OAuth providers, and backend session handling without replacing the route structure or rebuilding the UI.

Backend auth services, databases, provider SDKs, and API integrations should be added behind stable route, server, and component boundaries when their product scope is defined.

## Routing

Use `src/app` and App Router route groups:

```txt
src/
  app/
    page.tsx
    layout.tsx
    globals.css
    (auth)/
      login/
        page.tsx
    (app)/
      dashboard/
        page.tsx
      clients/
        page.tsx
      billing/
        page.tsx
    api/
      auth/
        [...nextauth]/
          route.ts

  components/
    ui/
      ButtonLink.tsx
      InputField.tsx
      Logo.tsx
      SectionHeading.tsx
    layout/
      Header.tsx
      Footer.tsx
    auth/
      LoginCard.tsx
      LoginForm.tsx
      IllustrationPanel.tsx

  server/
    auth/
      options.ts
      password.ts
    feature/
      queries.ts
      mutations.ts
      types.ts
    db/
      prisma.ts
```

Route groups do not appear in public URLs.

- `/` redirects to `/login`.
- `/login` renders the public authentication page from `src/app/(auth)/login/page.tsx`.
- `/dashboard` renders the main post-login app page from `src/app/(app)/dashboard/page.tsx`.
- `/clients` renders the clients app page from `src/app/(app)/clients/page.tsx`.
- `/billing` renders the billing app page from `src/app/(app)/billing/page.tsx`.

Keep route-level concerns in `src/app` and reusable UI in `src/components`.

## Authentication Entry

The login page must be production-facing in structure and copy:

- Show the reusable Webluma logo.
- Show a responsive two-column login card on desktop.
- Include a SaaS-themed illustration panel.
- Include real `email` and `password` inputs with labels, placeholders, validation affordances, and autocomplete attributes.
- Use a real form submit button for email/password login.
- Keep the existing Email, OAuth, and Guest entry behavior unless this spec is updated for backend integration work.
- Route successful entry actions to `/dashboard`.
- Do not add registration, password reset, new provider callbacks, auth libraries, API routes, database access, or session storage unless that scope is explicitly defined.

When real auth is added later, the form submission path should be replaced with the project's chosen server action, route handler, or auth client while keeping the `/login` route and component boundaries stable.

## App Pages

`/dashboard`, `/clients`, and `/billing` are protected app routes. They should build correctly, use the shared theme, and keep workflows aligned with defined product scope.

Post-login pages should use production-ready route surfaces, even when a workflow is intentionally narrow or still being expanded.

## Visual Direction

The authentication page should feel like a clean SaaS product:

- Large Webluma logo near the top.
- Centered login card with a rounded white container.
- Creative left-side illustration/art panel.
- Right-side login form with clear hierarchy and concise SaaS-focused copy.
- Modern spacing, subtle borders, and soft shadows.
- Responsive layout that stacks or reduces the illustration on small screens.

Use local SVG/vector artwork or locally defined decorative elements instead of remote assets.

## Brand

App name: **Webluma**

The reusable SVG wordmark should render:

- `Web` in Midnight Slate.
- `luma` in Luma Blue.
- Bold, clean, modern typography.
- SVG output, not plain text only.

## Color Palette

Use this palette consistently:

| Role            | Name           | Hex       |
| --------------- | -------------- | --------- |
| Primary dark    | Midnight Slate | `#0F172A` |
| Main accent     | Luma Blue      | `#38BDF8` |
| Secondary glow  | Soft Mint      | `#99F6E4` |
| Background      | Cloud White    | `#F8FAFC` |
| Neutral text    | Slate Gray     | `#64748B` |
| Border/light UI | Mist Gray      | `#CBD5E1` |

Derived tints are allowed when needed for hover states, focus rings, and subtle backgrounds.

## Components

Required reusable components:

- `Header`
- `Footer`
- `ButtonLink`
- `SectionHeading`
- `Logo`
- `InputField`
- `LoginCard`
- `LoginForm`
- `IllustrationPanel`

Prefer server components by default. Use client components only for form interactivity and navigation.

## Security And Integration Guidance

- Do not commit secrets.
- Keep user-facing auth errors generic.
- Validate email/password input before sending it to future auth services.
- Do not use `eval`, `new Function`, or string-based timers.
- Do not weaken Content Security Policy for development-only warnings.
- Use environment variables for future auth provider configuration.

## Line Endings

Use LF line endings. Keep `.gitattributes` configured with:

```txt
* text=auto eol=lf
```

## Acceptance Criteria

- The app uses `src/app` and `src/components` for the route and component tree.
- `/` redirects to `/login`.
- `/login`, `/dashboard`, `/clients`, and `/billing` build and route correctly.
- The login page uses the `(auth)` route group.
- Protected app pages use the `(app)` route group.
- The login form has real email/password fields and a real submit button.
- Existing Email, OAuth, and Guest entry behavior is preserved.
- Successful login-related entry actions route to `/dashboard`.
- Required reusable components exist in the correct component groups.
- Imports, route targets, and TypeScript path aliases match the new structure.
- `npm run lint` passes.
- `npm tsc --noEmit` passes, or any command limitation is documented.
