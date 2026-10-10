# Personal Project Management Tracker --- Vibe Coding Specification

> **Purpose:** Build a polished, reliable personal project management
> web application for one project manager to plan daily work, manage
> tasks across multiple projects and clients, track deadlines and
> follow-ups, and retain a searchable history of completed work.
>
> **Product principle:** Keep the experience simple. The user should be
> able to open the dashboard each morning, understand what needs
> attention, and update tasks quickly.

------------------------------------------------------------------------

## 1. Instructions to the AI Coding Agent

Act as a senior full-stack engineer, product designer, database
architect, and QA engineer. Build the application described in this
specification, not just a static mockup.

### How to work

1.  Inspect the existing repository before making changes. Preserve
    working configuration and conventions where sensible.
2.  If the repository is empty, initialize the project using the stack
    below.
3.  Build in small, testable phases. Keep the application runnable after
    each phase.
4.  Use real Supabase persistence for application data. Do not pretend
    local mock data is saved to the database.
5.  Use sample/demo data only when explicitly labelled as demo data. Do
    not silently mix demo records with real user records.
6.  If Supabase credentials are not available yet, build a clear setup
    path and a safe development mode. Never hardcode secrets or
    fabricate successful database operations.
7.  Implement loading, empty, success, and error states for all
    data-driven screens.
8.  Run linting, type checks, and available tests. Fix issues before
    declaring the work complete.
9.  Do not stop after producing a plan or a design. Implement the
    requested application and document any setup steps that require the
    user.
10. When a requirement is ambiguous, prefer the simplest solution that
    supports the stated personal workflow. Do not add enterprise
    features without a clear need.

------------------------------------------------------------------------

## 2. Product Overview

### Working name

**Personal PM Tracker**

The name should be easy to change from one central configuration file.

### What this application is

A private personal work tracker used by one project manager to manage
their own responsibilities across multiple client projects.

Typical work includes: - Project planning and progress monitoring -
Client follow-ups and pending approvals - Team coordination - Meetings
and meeting notes - Documentation and reporting - Reviews and quality
checks - Deadlines, blockers, and next actions - Weekly review of
completed work

### What this application is not

Do not build: - A multi-manager or employee task allocation platform -
An employee performance monitoring system - A Jira or Monday.com clone -
A complicated resource allocation or timesheet platform - A chat or
social collaboration platform - A system with unnecessary task IDs
displayed to the user - A dashboard filled with decorative charts that
do not help the user act

The application can have internal database IDs, but do not show
technical IDs in normal UI.

### Primary user

One authenticated personal user. Design the database so it can safely
support the authenticated user's records, but do not build multi-user
collaboration, team roles, or organization administration in the MVP.

### Main outcomes

1.  Know what to do today.
2.  Identify high-priority, overdue, blocked, and waiting tasks.
3.  Record work with minimal effort.
4.  Keep active tasks separate from completed work in the interface.
5.  Preserve completed work and actual completion dates.
6.  Review weekly progress without manually counting tasks.
7.  Access the tracker on desktop and mobile.

------------------------------------------------------------------------

## 3. Required Technology Stack

Use the following stack unless the existing repository has a sound,
documented reason to retain a compatible alternative.

-   **Framework:** Next.js with App Router
-   **Language:** TypeScript with strict mode
-   **UI:** React
-   **Styling:** Tailwind CSS
-   **Components:** shadcn/ui where useful; do not add components just
    for the sake of using a library
-   **Icons:** Lucide icons
-   **Backend and database:** Supabase (PostgreSQL)
-   **Authentication:** Supabase Auth
-   **Validation:** Zod and React Hook Form where appropriate
-   **Date handling:** date-fns or an equivalent lightweight library
-   **Deployment:** Vercel
-   **Version control:** Git

Use current stable, mutually compatible package versions at
implementation time. Avoid unnecessary dependencies.

### Supabase rules

-   Keep the Supabase URL and anon/publishable key in environment
    variables.
-   Never expose the service-role key in browser code.
-   Never use a service-role key as a workaround for a broken Row Level
    Security policy.
-   Use Row Level Security (RLS) for every user-owned table.
-   Use server-side operations for sensitive mutations and workflow
    transitions.
-   Validate input on the server, even when client-side validation
    exists.
-   Store timestamps consistently; render dates in the user's configured
    timezone.

Example environment file:

``` env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Only if a server-only task genuinely requires it:
SUPABASE_SERVICE_ROLE_KEY=
```

Do not commit real `.env` files. Include `.env.example` with placeholder
values only.

------------------------------------------------------------------------

## 4. Information Architecture and Navigation

Create a clean application shell with:

-   A left sidebar on desktop
-   A responsive drawer or compact navigation on smaller screens
-   A clear page title and short supporting description
-   A primary action such as **Add Task**
-   A user/account menu with sign out
-   A restrained visual system with consistent spacing and colours

Required navigation:

1.  **Dashboard**
2.  **Daily Planner**
3.  **Task History**
4.  **Projects**
5.  **Reports**
6.  **Settings**

Do not create separate pages for features that can be handled more
simply in a dialog or detail panel.

------------------------------------------------------------------------

## 5. Dashboard

The dashboard is the first page after login. It must help the user
decide what to do, not merely display attractive numbers.

### 5.1 Dynamic KPI cards

Show compact statistic cards for:

1.  **Today's Tasks** --- active tasks planned for today
2.  **Open Tasks** --- all active, non-completed tasks
3.  **In Progress** --- tasks whose status is In Progress
4.  **High Priority** --- active high-priority tasks
5.  **Overdue** --- tasks with a deadline before today that are not
    completed
6.  **Waiting** --- tasks waiting on a client, team member, approval, or
    other dependency
7.  **Completed This Week** --- tasks completed during the current
    calendar week
8.  **Upcoming** --- active tasks planned within the next seven days,
    excluding completed tasks

Each KPI must be calculated from database records or a reliable shared
query layer. Do not hardcode values. The definition of each statistic
must be consistent throughout the application.

Clicking a KPI should take the user to the relevant filtered task list
when practical.

### 5.2 Today's Tasks table

Below the KPI cards, show a compact list of today's active tasks.

Columns: - Client / Project - Task / Activity - Priority - Status -
Deadline

Sort tasks so the most urgent items appear first. Use a clear empty
state if there are no tasks for today.

### 5.3 Needs Attention table

Show tasks that need the user's attention: - Overdue tasks -
High-priority active tasks - Tasks with Waiting status

Columns: - Client / Project - Task / Activity - Deadline - Priority -
Status / Reason

Avoid duplicating the same task multiple times in this list. Where a
task meets multiple conditions, show it once and display a concise
reason such as "Overdue · High priority."

### 5.4 Dashboard design

-   Compact cards with clear labels and readable values
-   Use colour intentionally, not decoratively
-   Keep task lists directly below the statistics
-   No oversized charts
-   If a chart is included later, it must answer a useful question and
    remain secondary
-   Dashboard must be responsive and usable at laptop width and on
    mobile

### 5.5 Refresh behaviour

After creating, editing, completing, reopening, or deleting a task,
update affected KPI values and lists without requiring a full page
reload. Use appropriate Next.js revalidation, query invalidation, or
refetching. Do not show stale statistics.

------------------------------------------------------------------------

## 6. Daily Planner

This is the main working screen. It should make entering and updating
tasks fast.

### 6.1 Task fields

Use these user-facing fields:

  -----------------------------------------------------------------------
  Field                   Required?               Description
  ----------------------- ----------------------- -----------------------
  Planned Date            Yes                     Date the user intends
                                                  to work on the task

  Client / Project        Recommended             Select an existing
                                                  project; allow an
                                                  unassigned task if
                                                  needed

  Task / Activity         Yes                     Clear action-oriented
                                                  description

  Category                Yes                     Type of project
                                                  management work

  Priority                Yes                     High, Medium, or Low

  Status                  Yes                     Planned, In Progress,
                                                  Waiting, or Completed

  Deadline                Optional                Date the task must be
                                                  completed

  Notes / Next Step       Optional                Context, blocker,
                                                  follow-up, or next
                                                  action
  -----------------------------------------------------------------------

Do not ask the user to enter a task ID. Generate an internal UUID in the
database.

### 6.2 Category options

Start with: - Project Planning - Client Follow-up - Team Coordination -
Meeting - Documentation - Progress Monitoring - Review - Reporting -
Administration - Other

Keep category options in one maintainable place. A Settings page may
allow the user to adjust them in a later phase, but custom category
management is not required for the first MVP.

### 6.3 Priority options

-   High
-   Medium
-   Low

### 6.4 Status options

-   Planned
-   In Progress
-   Waiting
-   Completed

Use a consistent status badge and corresponding row styling: - Planned:
pale grey or pale blue - In Progress: blue - Waiting: yellow / amber -
Completed: green - Overdue: red emphasis

Status colour and overdue state are separate concepts. An overdue task
may also be Waiting or In Progress. Ensure overdue tasks are clearly
identified without hiding their underlying status. Completed tasks must
never appear overdue.

Use accessible text labels in addition to colour; do not rely on colour
alone.

### 6.5 Add and edit task experience

Use a clear **Add Task** button and a compact dialog or side panel.
Fields must be labelled. Include: - Required-field validation - Date
validation - Clear Save and Cancel actions - Saving indicator - Success
feedback - Helpful error messages - Protection against accidental
duplicate submission

Allow editing from the table or a task detail panel. Use sensible
defaults, such as today's date for Planned Date, but allow the user to
change them.

### 6.6 Planner table controls

Include: - Search by task name, project/client, or notes where
practical - Filter by project - Filter by status - Filter by priority -
Filter by planned date or date range - Filter for overdue tasks - Sort
by planned date, deadline, priority, or status - Clear all filters
action - Pagination or sensible server-side loading for larger lists

Default view should focus on active tasks. Completed tasks should not
clutter the planner.

### 6.7 Recommended default sorting

Sort active tasks using: 1. Overdue tasks first 2. High priority before
Medium and Low 3. Earliest deadline 4. Planned date

Provide a clear way to change the sort order.

### 6.8 Task details

A user can open a task to see and edit: - All task fields - Created
date - Last updated date - Completion date, if completed - Activity
timeline of meaningful changes

Keep the default table compact. Do not show every optional detail as a
table column.

------------------------------------------------------------------------

## 7. Task Completion and Task History

This is a critical requirement. Implement actual persisted behaviour,
not a formula-only visual copy.

### 7.1 Expected workflow

When the user changes a task's status to **Completed**:

1.  Validate the task and current status.
2.  Persist the status as Completed.
3.  Record a fixed `completed_at` timestamp on the task.
4.  Add a task activity record for the status change.
5.  Remove the task from the active Daily Planner query/view.
6.  Show the task in Task History.
7.  Refresh the dashboard statistics and lists.
8.  Ensure the operation cannot create duplicate history records.

Use a database transaction or a safe server-side workflow where
necessary. If the chosen Supabase interaction cannot run a transaction
directly, use a PostgreSQL function/RPC or another well-defined atomic
server-side operation.

**Do not delete the underlying task record and copy it into a second
tasks table.** The preferred model is one durable task record whose
status changes; active planner and history are different views over that
same record. This reduces risk of data loss and duplication.

### 7.2 Completion date

-   Record the actual completion timestamp when a task first becomes
    Completed.
-   Do not calculate the completion date using a volatile display
    formula.
-   Do not overwrite the original completion date on ordinary reads.
-   If a completed task is reopened, retain the activity history. Clear
    or update `completed_at` according to a clearly defined policy;
    recommended behaviour: clear the current `completed_at` when
    reopened, while preserving the earlier completion event in
    `task_activity`.
-   If completed again later, record a new completion event and a new
    current completion timestamp.
-   Render date/time in the user's configured timezone.

### 7.3 Task History page

Display completed tasks, newest completion first.

Columns: - Completed Date - Client / Project - Task / Activity -
Category - Priority - Planned Date - Deadline - Notes / Outcome

Features: - Search by task, project/client, or notes - Filter by
project - Filter by completion date range - Filter by category and
priority - Open task details - View activity history - Optional export
to CSV

History must remain available after sign-out, browser refresh, and
reopening the application.

### 7.4 Restore / reopen behaviour

Allow the user to reopen a task from Task History. Confirm the action if
appropriate. The task returns to the active planner, and the activity
timeline records the reopening. Do not silently delete its history.

### 7.5 Deletion

Avoid destructive deletion by default. If deleting a task is
supported: - Ask for confirmation - Clearly state the consequences -
Prefer soft deletion or an archive strategy - Ensure accidental deletion
cannot silently erase completed history

------------------------------------------------------------------------

## 8. Projects Page

The Projects page keeps project names consistent so the user does not
need to type the same client/project name for every task.

### Project fields

-   Project Name (required)
-   Client Name (optional)
-   Description (optional)
-   Project Status: Active, On Hold, Completed, Archived
-   Start Date (optional)
-   Target End Date (optional)
-   Notes (optional)

### Features

-   Create, edit, view, and archive projects
-   Search and filter projects
-   Show a compact count of active, completed, and overdue tasks for
    each project
-   Open a project to see its related tasks
-   Prevent normal deletion if the project has related tasks; recommend
    archiving instead
-   Allow tasks without a project when appropriate

Keep project management lightweight. This is a personal task tracker,
not a full project scheduling or resource planning tool.

------------------------------------------------------------------------

## 9. Reports Page

Create a practical weekly/monthly review page for the user's own work.

### Date range

Support: - This week - Last week - This month - Custom date range

### Summary metrics

-   Tasks completed in the selected period
-   Tasks still open
-   Overdue tasks
-   Tasks completed by project
-   Tasks by category
-   Tasks waiting for others

### Completed work list

Show tasks completed within the selected period, with project, task,
category, completion date, and notes/outcome.

### Export

Allow export of filtered completed work to CSV. If PDF export is later
added, it must be readable and formatted for reporting.

Reports must use persisted records and a consistent definition of the
selected date range. Do not count the same completion event twice.

------------------------------------------------------------------------

## 10. Settings Page

Keep settings simple.

MVP settings: - Display name, if available from the authenticated
profile - Timezone - Preferred date format if straightforward - Sign
out - Short explanation of data privacy

Do not build complex organization settings, team permissions, or user
administration.

Use a consistent default timezone. Store timestamps safely and render
them in the configured timezone. Treat date-only fields as calendar
dates, not arbitrary timestamps, to avoid date shifting.

------------------------------------------------------------------------

## 11. Authentication and Security

The application is private and personal. Implement authentication before
production deployment.

### Requirements

-   Supabase Auth login
-   Sign out
-   Protected application routes
-   Useful loading state during session resolution
-   Redirect unauthenticated users to login
-   Redirect authenticated users away from the login page where
    appropriate
-   No public access to personal task data
-   RLS on all user-owned tables
-   Every read, update, insert, and delete must be scoped to the
    authenticated user
-   Validate ownership of linked projects before attaching them to a
    task
-   Prevent users from assigning a task to another user's project
-   Keep server secrets server-side
-   Never log credentials or sensitive notes
-   Handle expired sessions and database errors safely

A single-user product still needs authentication and RLS when deployed
online.

### Supabase Row Level Security

Enable RLS on `profiles`, `projects`, `tasks`, and `task_activity`.

Policies must ensure: - Users can read only their own records. - Users
can insert only records owned by their authenticated user ID. - Users
can update only their own records. - Users cannot change ownership to
another user. - Task activity access is limited to tasks the user
owns. - Project references belong to the same authenticated user.

Do not rely on frontend filters as the security boundary. Verify
policies through tests or a documented manual test plan.

------------------------------------------------------------------------

## 12. Proposed Database Design

Use PostgreSQL UUID primary keys and foreign keys. Add indexes for
commonly filtered columns. Use database constraints for allowed status
and priority values where appropriate.

### 12.1 `profiles`

Suggested columns: - `id` UUID primary key referencing
`auth.users(id)` - `display_name` text nullable - `timezone` text not
null, with a safe default - `created_at` timestamptz not null -
`updated_at` timestamptz not null

### 12.2 `projects`

Suggested columns: - `id` UUID primary key - `user_id` UUID not null
references `auth.users(id)` - `name` text not null - `client_name` text
nullable - `description` text nullable - `status` text not null with a
constraint: `Active`, `On Hold`, `Completed`, `Archived` - `start_date`
date nullable - `target_end_date` date nullable - `notes` text
nullable - `created_at` timestamptz not null - `updated_at` timestamptz
not null - Optional `archived_at` timestamptz

### 12.3 `tasks`

Suggested columns: - `id` UUID primary key - `user_id` UUID not null
references `auth.users(id)` - `project_id` UUID nullable references
`projects(id)` - `title` text not null - `category` text not null -
`priority` text not null with a constraint: `High`, `Medium`, `Low` -
`status` text not null with a constraint: `Planned`, `In Progress`,
`Waiting`, `Completed` - `planned_date` date not null - `deadline` date
nullable - `notes` text nullable - `completed_at` timestamptz nullable -
`created_at` timestamptz not null - `updated_at` timestamptz not null -
Optional `deleted_at` timestamptz for soft deletion

Rules: - When status is Completed, `completed_at` must be set. - When
status is not Completed, current `completed_at` should normally be
null. - Enforce completion-date consistency in a trusted
database/server-side workflow, not just a client component. - If
`project_id` is not null, verify that the project belongs to the same
`user_id`. - Prevent accidental creation of blank task titles.

### 12.4 `task_activity`

Suggested columns: - `id` UUID primary key - `user_id` UUID not null
references `auth.users(id)` - `task_id` UUID not null references
`tasks(id)` - `event_type` text not null, e.g. `created`, `updated`,
`status_changed`, `completed`, `reopened`, `archived` - `old_status`
text nullable - `new_status` text nullable - `summary` text nullable -
`created_at` timestamptz not null

Record meaningful events such as creation, status changes, completion,
reopening, and important edits. Do not record every UI render as
activity. Apply RLS to activity records.

### 12.5 Data integrity and indexes

-   Add indexes for `tasks(user_id, status)`,
    `tasks(user_id, planned_date)`, `tasks(user_id, deadline)`,
    `tasks(user_id, priority)`, and `tasks(project_id)`.
-   Add suitable indexes for task history ordered by `completed_at`.
-   Use `NOT NULL`, foreign keys, check constraints, and unique
    constraints where appropriate.
-   Add triggers or database functions for `updated_at` and safe
    activity logging if that is the chosen architecture.
-   Ensure task and project ownership consistency.
-   Provide versioned Supabase SQL migrations in the repository.
-   Do not rely on manually editing production tables through the
    Supabase dashboard as the only schema management method.

The exact schema may be refined during implementation, but preserve
these behaviours and ownership boundaries.

------------------------------------------------------------------------

## 13. Design System and UX Direction

Aim for a modern, restrained productivity interface.

### Visual direction

-   Professional and calm
-   Light neutral background
-   White or near-white content surfaces
-   Dark navy/charcoal text
-   Blue as the main action colour
-   Teal as a secondary accent
-   Green for completed
-   Amber for waiting or caution
-   Red for overdue or urgent
-   Rounded cards and controls, used consistently
-   Subtle borders and shadows
-   Strong typography hierarchy
-   Enough whitespace without wasting screen space

Avoid: - Excessive gradients - Too many accent colours - Huge KPI
cards - Overly dense tables - Excessive rounded pills on every element -
Decorative graphs with no practical value - Too many animations - UI
that looks like a generic admin template without attention to task
workflow

### Table UX

-   Keep columns readable and concise
-   Use status badges with text
-   Keep important actions easy to find
-   Use hover states and keyboard focus styles
-   On mobile, switch to compact task cards or a horizontal-scroll
    strategy that remains usable
-   Preserve useful filters on small screens
-   Make forms accessible and easy to use with a keyboard

### Accessibility

-   Semantic HTML
-   Visible focus indicators
-   Proper labels and error descriptions
-   Sufficient contrast
-   Do not communicate state by colour alone
-   Accessible dialogs and menus
-   Buttons must have clear labels

------------------------------------------------------------------------

## 14. Sample Data and Demo Experience

Provide a deliberate demo-data strategy.

Example projects: - SunShine Project - Indoor Sports Venue Booking
System - Webtezza Website - Internal Planning

Example tasks: - Review project programme before submission - Follow up
on pending client approval - Prepare meeting agenda - Update project
requirements - Review website wireframes - Prepare weekly progress
report - Document meeting decisions - Monitor milestone progress

Include varied priorities and statuses, plus at least one overdue task
and one completed task.

### Important demo rules

-   Clearly label any seeded sample records.
-   Do not automatically insert demo records into a real user's account
    without asking or providing an explicit "Load demo data" action.
-   Prefer a demo mode or a controlled seed script.
-   Do not confuse fake records with real project information.
-   Ensure the dashboard calculations can be verified using the sample
    data.
-   Include a way to clear demo records safely if this feature is
    provided.

------------------------------------------------------------------------

## 15. Error, Loading, Empty, and Success States

Every data-driven page must handle:

-   Initial loading
-   No tasks yet
-   No search results
-   No projects yet
-   Network/database error
-   Expired session
-   Validation errors
-   Save in progress
-   Successful create/update
-   Failed task completion
-   Failed history/activity loading

Use clear, user-friendly messages. Do not expose SQL errors, environment
values, access tokens, or stack traces to the UI.

If a completion operation fails, keep the task visible in the planner
and explain that it was not completed successfully. Do not
optimistically hide a task without handling rollback.

------------------------------------------------------------------------

## 16. Performance and Reliability

-   Use server-side queries where appropriate.
-   Fetch only the columns needed for each view.
-   Add pagination or bounded result sets for large lists.
-   Avoid repeated database requests for the same dashboard statistic if
    a shared query can be used.
-   Do not issue one database request per table row.
-   Avoid unnecessary client-side state duplication.
-   Prevent duplicate form submission.
-   Handle stale data after mutations.
-   Keep code modular and maintainable.
-   Use TypeScript types derived from the database schema where
    practical.
-   Keep business rules in a shared service/database layer, not
    duplicated across components.

------------------------------------------------------------------------

## 17. Suggested Repository Structure

Use a structure similar to this, adapting it to the actual Next.js
version and repository:

``` text
personal-pm-tracker/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── planner/
│   │   ├── history/
│   │   ├── projects/
│   │   ├── reports/
│   │   └── settings/
│   ├── api/                    # Only where appropriate
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── tasks/
│   ├── projects/
│   ├── reports/
│   └── ui/
├── lib/
│   ├── supabase/
│   ├── validations/
│   ├── queries/
│   ├── actions/
│   ├── dates/
│   └── utils/
├── types/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
├── public/
├── .env.example
├── README.md
└── trackerprompt.md
```

Do not force this exact structure if the framework conventions or
existing repository suggest a better maintainable arrangement.

------------------------------------------------------------------------

## 18. Testing Requirements

Write appropriate tests for important business rules and run them before
completion.

### Functional tests

1.  User can sign in and sign out.
2.  Unauthenticated users cannot access protected pages.
3.  User can create a task.
4.  User can edit task details.
5.  User can filter by project, priority, status, and date.
6.  User can create and edit projects.
7.  Dashboard statistics match the task records.
8.  A deadline before today is overdue only when the task is not
    Completed.
9.  Changing a task to Completed records a fixed completion timestamp.
10. A completed task disappears from the active planner view.
11. The completed task appears exactly once in Task History.
12. Refreshing the page does not lose completed records.
13. Reopening a task returns it to the planner and records the reopening
    event.
14. Completion failure does not silently hide the task.
15. User cannot read or modify another user's records.
16. A task cannot reference another user's project.
17. Weekly report boundaries use the configured timezone consistently.
18. CSV export contains the selected filtered records only.

### UI checks

-   Test loading, empty, error, and success states.
-   Check responsive layouts at desktop, tablet, and mobile widths.
-   Check that long project names and task descriptions do not break the
    layout.
-   Check keyboard navigation and focus indicators.
-   Verify status and priority remain understandable without colour
    alone.

### Quality checks

-   TypeScript check
-   Lint
-   Unit/integration tests where configured
-   Build
-   Review console and server logs for avoidable errors

Never claim tests passed unless they were actually run.

------------------------------------------------------------------------

## 19. Implementation Roadmap

Build in this order:

### Phase 1 --- Foundation

-   Inspect repository
-   Initialize Next.js, TypeScript, Tailwind, and UI components
-   Set up the application shell and navigation
-   Create responsive page layouts
-   Create `.env.example` and setup documentation

### Phase 2 --- UI with controlled demo data

-   Build Dashboard
-   Build Daily Planner
-   Build task add/edit form
-   Build Task History
-   Build Projects
-   Build Reports
-   Verify usability with realistic demo records

If Supabase is not configured yet, use a clearly isolated demo-data
adapter. Do not make fake persistence appear real.

### Phase 3 --- Supabase and authentication

-   Configure Supabase client/server helpers
-   Create SQL migrations
-   Add authentication and protected routes
-   Add tables, constraints, indexes, and RLS
-   Connect project and task CRUD
-   Test ownership and data access

### Phase 4 --- Completion workflow and history

-   Implement reliable completion transition
-   Record fixed completion timestamp
-   Add activity logging
-   Move tasks out of active view and into history view
-   Support reopening without losing earlier activity records
-   Refresh all affected dashboard metrics

### Phase 5 --- Reports and polish

-   Weekly/monthly reports
-   CSV export
-   Search, filters, and sorting
-   Responsive refinements
-   Accessibility improvements
-   Error-state polish

### Phase 6 --- QA and deployment

-   Run tests, lint, type checking, and production build
-   Review RLS policies
-   Test real completion and reopening workflows
-   Document Supabase setup and migrations
-   Deploy to Vercel
-   Document environment variables and deployment steps

------------------------------------------------------------------------

## 20. Definition of Done

The application is not complete until all the following are true:

-   [ ] It runs locally with documented setup instructions.
-   [ ] The UI is responsive and visually consistent.
-   [ ] Authentication protects personal data.
-   [ ] Supabase stores real projects and tasks.
-   [ ] RLS protects every user-owned table.
-   [ ] The Dashboard is dynamic and reflects persisted data.
-   [ ] Daily Planner supports create, edit, search, filter, and sort.
-   [ ] Status and priority are clear and colour-coded.
-   [ ] Overdue detection is correct.
-   [ ] Completed tasks are removed from the active planner view.
-   [ ] Completed tasks remain permanently available in Task History.
-   [ ] Completion dates are fixed and accurate.
-   [ ] Reopening a task preserves activity history.
-   [ ] No duplicate completed-history entries are created.
-   [ ] Weekly reports use real task data.
-   [ ] Errors do not cause silent data loss.
-   [ ] Tests, lint, type checks, and build are run and their results
    reported.
-   [ ] `.env.example`, SQL migrations, and README are included.
-   [ ] No secrets are committed or exposed in browser code.

------------------------------------------------------------------------

## 21. Final Instruction to the Coding Agent

Begin by inspecting the repository and identifying what already exists.
Then implement the application phase by phase.

Prioritize a simple, polished, trustworthy personal workflow over
feature quantity. Do not build unnecessary team management or enterprise
functionality. Do not substitute a static design for a working
application. Do not fake database persistence.

The most important user journey is:

**Open Dashboard → See today's and urgent tasks → Add or update a task
in Daily Planner → Mark it Completed → Task leaves the active view and
appears in Task History → Dashboard and weekly reports update
automatically.**

At the end, provide: 1. A summary of what was implemented 2. The files
and main components created 3. Supabase setup and migration instructions
4. Required environment variables 5. Commands to run, test, and build
the application 6. Any incomplete features or limitations stated
honestly
