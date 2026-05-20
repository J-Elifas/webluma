# SPEC.md

## Project Overview

Build the initial UI for a CMS web app named **Webluma**.

The first deliverable is a polished login page inspired by the provided reference image, plus a minimal blank app page that users reach after pressing either the login button or guest login button.

This is an **npm + TypeScript + Next.js + Tailwind CSS** project.

Do not add database, SQL, backend, authentication services, OAuth, API integrations, or third-party login providers yet.

---

## Visual Direction

The login page should follow the same overall structure as the reference:

- Large logo at the top/upper-left area.
- Centered login card layout.
- Left side: creative illustration/art panel.
- Right side: login form.
- Rounded white container/card.
- Soft, clean CMS/SaaS feel.
- Modern spacing, shadows, borders, and responsive behavior.

Be creative with the artwork. Use an illustration that matches the color palette and CMS/productivity theme. Prefer a custom inline SVG/vector-style illustration or locally defined decorative artwork instead of remote assets.

---

## Brand

App name: **Webluma**

Create a custom SVG logo for the text **Webluma**.

Logo style:

- `Web` uses Primary dark.
- `luma` uses Main accent.
- Bold, clean, modern wordmark.
- Similar feel to the reference logo image.
- Use SVG, not plain text only.
- The logo should be reusable as a component.

---

## Color Palette

Use this palette consistently across the UI:

| Role | Name | Hex |
|---|---|---|
| Primary dark | Midnight Slate | `#0F172A` |
| Main accent | Luma Blue | `#38BDF8` |
| Secondary glow | Soft Mint | `#99F6E4` |
| Background | Cloud White | `#F8FAFC` |
| Neutral text | Slate Gray | `#64748B` |
| Border/light UI | Mist Gray | `#CBD5E1` |

Tailwind config may be extended to include these brand colors.

---

## App Router Folder Structure

Use route groups to separate authentication pages from the actual app pages.

Required route group structure:

```txt
src/
  app/
    (auth)/
      page.tsx
    (app)/
      app/
        page.tsx
  components/
    Header.tsx
    Footer.tsx
    ButtonLink.tsx
    SectionHeading.tsx
    Logo.tsx
    InputField.tsx
    LoginCard.tsx
    IllustrationPanel.tsx
```

Notes:

- `(auth)` contains the login page.
- `(app)` contains the actual page after login.
- Route groups should not affect the public URL.
- The login page should still be available at `/`.
- The post-login placeholder page should be available at `/app`.
- Adjust file placement only if the existing project already uses a different but equivalent route-group convention.

---

## Pages / Routes

### `/`

Login page located under the `(auth)` route group.

Required behavior:

- Show the Webluma logo.
- Show a large responsive login card.
- Left side contains a creative CMS-themed illustration/art panel.
- Right side contains:
  - Login heading.
  - Email input.
  - Password input.
  - Login button.
  - Guest Login button.
- Do not implement real authentication.
- For now, the **Login** button and **Guest Login** button have the same functionality.
- Pressing either button should route directly to `/app` without requiring email or password.

Navigation:

- Use `Link` from `next/link` where appropriate.
- For button-triggered navigation, use standard Next.js navigation patterns.

### `/app`

Base app page after login located under the `(app)` route group.

Required behavior:

- White blank page.
- Show a small success indication, for example:
  - “Login successful”
  - “Welcome to Webluma”
- Do not build CMS features yet.
- This page is only a placeholder for future development.

---

## Authentication Constraints

For now:

- Do not use OAuth.
- Do not use Google, Facebook, Apple, GitHub, or any third-party provider.
- Do not add auth libraries.
- Do not add backend session handling.
- Do not connect to a database.
- Do not add API routes for login.
- Login and Guest Login are only simple frontend route transitions to `/app`.

---

## Components

Build simple custom reusable components. At minimum:

- `Header`
- `Footer`
- `ButtonLink`
- `SectionHeading`
- `Logo`
- `InputField`
- `LoginCard`
- `IllustrationPanel`

Use existing project styling patterns if the project already has them.

Keep components small, readable, and reusable.

---

## UI Requirements

Login page:

- Responsive desktop layout with two columns inside the card.
- On smaller screens, stack the illustration and form vertically or hide/reduce the illustration if needed.
- Use rounded corners, soft shadows, subtle gradients, and clean borders.
- Use the provided palette only or very close tints derived from it.
- Form inputs should have icons or simple visual affordances if practical.
- Login and Guest Login buttons should both clearly lead into the app for now.
- Avoid clutter.

Expected result:

A user lands on `/`, sees a beautiful Webluma login page, presses either **Login** or **Guest Login**, and is routed to `/app`, where a blank success page appears.

---

## Technical Requirements

- Use Next.js with TypeScript.
- Use Tailwind CSS for styling.
- Use npm.
- Prefer server components by default.
- Use client components only where interactivity or navigation requires it.
- Avoid unnecessary dependencies.
- Do not introduce state management libraries.
- Do not add backend functionality.

---

## CSP / Security Guidance

Avoid patterns that can cause Content Security Policy issues:

- Do not use `eval`.
- Do not use `new Function`.
- Do not use string-based `setTimeout`.
- Do not use string-based `setInterval`.
- Do not add `unsafe-eval` unless there is absolutely no safe alternative.

If a CSP warning only happens in development, document it clearly in a short comment or project note instead of weakening production CSP.

---

## Line Endings

Use LF line endings.

Add or document `.gitattributes` if needed to prevent LF to CRLF warnings.

Recommended `.gitattributes`:

```txt
* text=auto eol=lf
```

---

## Non-Goals

Do not implement:

- CMS dashboard features.
- Database schema.
- SQL.
- Backend services.
- Real authentication.
- OAuth.
- User registration.
- Password reset.
- External auth providers.
- API routes unless strictly required by the existing project.
- Third-party plugins for login or backend behavior.

---

## Acceptance Criteria

The task is complete when:

- `/` renders the Webluma login page from the `(auth)` route group.
- `/app` renders the blank success page from the `(app)` route group.
- The design follows the reference layout and uses the specified color palette.
- A reusable SVG Webluma logo exists.
- Login and Guest Login both route to `/app` without password or backend logic.
- Required reusable components are created.
- No database, OAuth, backend, or third-party auth functionality is added.
- LF line-ending guidance is handled or documented.
- CSP guidance is followed.
