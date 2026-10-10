# Personal PM Tracker

A private, responsive project-management workspace for one user. This starter uses Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth, PostgreSQL, and Row Level Security. It does not silently seed demo data or pretend to save locally.

## Included in this starter

- Dashboard with live task counts, today's tasks, and a deduplicated attention list.
- Daily Planner with task create/edit, search, project/status/priority/date filters, and urgency sorting.
- Task completion and reopening through a PostgreSQL RPC; database triggers set a fixed completion time and record activity.
- Task History and CSV export.
- Project create/edit and active, overdue, completed task counts.
- Weekly, prior-week, and monthly completed-work reports.
- Settings for display name and timezone.
- Supabase Auth route protection and RLS policies for profiles, projects, tasks, and task activity.
- Empty, setup, save feedback, and error states.

## Requirements

- Node.js 20.9 or newer
- A Supabase project

## Local setup

1. Install dependencies with npm install.
2. Copy .env.example to .env.local.
3. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Supabase project's URL and publishable/anon key. Never add a service-role key to a NEXT_PUBLIC_ variable.
4. In Supabase SQL Editor, run supabase/migrations/202610110001_initial_schema.sql.
5. In Supabase Authentication, create your personal user (or enable the sign-up method you want) and confirm email if required by your project settings.
6. Start with npm run dev, then open the local URL printed by Next.js.

For production, configure the same public URL/key as deployment environment variables, set the correct Supabase Auth site URL and redirect URLs, and deploy the app. Use HTTPS.

## Environment variables

- NEXT_PUBLIC_SUPABASE_URL: Supabase project URL.
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase publishable/anon key; safe for browser use when RLS is correctly enabled.
- NEXT_PUBLIC_APP_NAME: reserved for central app naming; optional in this starter.

## Database and security notes

The migration creates the schema, indexes, ownership constraints, updated-at and activity triggers, completion timestamp handling, and RLS policies. Tasks and projects are owned by auth.uid(). A composite foreign key prevents linking a task to another user's project. The set_task_status RPC is security-invoker and relies on RLS; the database trigger preserves completion history without duplicating task records.

After applying the migration, verify RLS by signing in as one account, creating a project and task, then checking that a second account cannot select or update those records. Do not use a service-role key to bypass RLS.

## Useful commands

- npm run dev — development server.
- npm run typecheck — TypeScript validation.
- npm test — focused unit tests for overdue/completion and urgency ordering.
- npm run build — production build.
- npm start — serve the production build.

## Current limitations

This is a starter implementation, not a production-certified system. It does not include self-service registration/password reset, pagination for very large task sets, advanced custom date-range/report filters, configurable date formats, physical task deletion, or end-to-end browser tests. The timezone setting is saved, but date rendering currently uses the server/runtime timezone and should be made user-timezone-aware before relying on cross-timezone reporting. CSV exports include only completed work. Review the migration and test RLS in your own Supabase project before storing sensitive client information.
