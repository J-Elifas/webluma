# Webluma

Webluma is a production-ready SaaS workspace built with Next.js, TypeScript, Tailwind CSS, Prisma, and NextAuth.js.

It is structured as a deployed web application with clear route ownership, reusable interface components, server-only data boundaries, and a quality workflow suitable for a professional software product.

## Overview

Webluma provides a polished workspace experience for business teams that need a focused, responsive, and secure web application. The project emphasizes maintainable architecture, consistent interface patterns, and reliable server-side foundations.

The application is designed for real deployment environments and keeps product surfaces, authentication boundaries, database access, and presentation code separated by responsibility.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- NextAuth.js
- Prisma ORM
- MySQL
- shadcn/ui
- Recharts
- Vitest
- Playwright

## Architecture

```txt
src/
  app/
    Route tree, layouts, page entry points, and route-owned controllers.

  components/
    Reusable presentation components for the application shell, auth surfaces,
    dashboard views, layout, and UI primitives.

  server/
    Server-only modules for authentication, database access, queries, mutations,
    and shared domain types.

prisma/
  Schema files, migrations, and seed data.

tests/
  Unit and browser-level verification.
```

The codebase favors Server Components by default, keeps browser interactivity scoped to client-owned components, and isolates server behavior from reusable presentation layers.

## Requirements

- Node.js and npm
- A MySQL-compatible database
- Environment variables configured for the target runtime

## Environment

Create a `.env` file for local development and configure equivalent secrets in production.

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-secure-secret"
```

For a deployed environment, set `NEXTAUTH_URL` to the production application origin.

## Local Development

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

The local app runs at:

```txt
http://localhost:3000
```

## Quality Checks

Run linting:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npx tsc --noEmit
```

Run tests once:

```bash
npm run test:run
```

Run a production build:

```bash
npm run build
```

Run browser tests:

```bash
npm run e2e
```

## Production

Webluma is designed for deployment on platforms that support Next.js server rendering, Node.js runtimes, managed environment variables, and a production database.

Before release, configure the production environment, apply database migrations, and build the application:

```bash
npm run build
```

Start the production server locally or in a compatible runtime:

```bash
npm run start
```

## Security

Sensitive configuration belongs in environment-managed secrets. Server-owned code stays under `src/server`, protected application behavior is enforced through server boundaries, and client components receive only the data required for presentation.

## License

Private.
