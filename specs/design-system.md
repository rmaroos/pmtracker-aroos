# Personal PM Tracker --- Design System & UI/UX Specification

**Document purpose:** Define the visual design, interaction patterns,
layout, and component behaviour for the Personal PM Tracker web
application.

**Product context:** A private, personal project management workspace
for one project manager who coordinates work across multiple client
projects. The design should help the user understand priorities quickly,
update tasks with minimal effort, and review completed work.

**Companion specification:** `trackerprompt.md` defines product
requirements, database behaviour, security, and implementation details.
This document defines how the product should look and feel. If the two
documents appear to conflict, preserve the functional and security
requirements in `trackerprompt.md` while following this document for
presentation and interaction design.

------------------------------------------------------------------------

## 1. Design Principles

### 1.1 Clear before decorative

The user should understand the current workload within a few seconds.
Prioritize readable task names, dates, status, and project information
over decoration.

### 1.2 Action-oriented dashboard

Every dashboard element should answer one of these questions: - What
should I work on today? - What is urgent? - What is overdue? - What am I
waiting for? - What have I completed?

### 1.3 Fast daily entry

Adding or updating a task should require as few interactions as
possible. Use sensible defaults, compact forms, dropdowns, and inline
actions where they remain accessible.

### 1.4 Calm professional appearance

Use a restrained palette, clear typography, subtle borders, consistent
spacing, and limited shadow. The UI should feel like a polished
productivity tool rather than a marketing website.

### 1.5 Consistent interaction

The same status, priority, button, date, and filtering patterns should
work consistently across the dashboard, planner, history, and project
pages.

### 1.6 Accessible beyond colour

Colour may reinforce status but must never be the only way to identify
it. Always display readable text labels and accessible contrast.

------------------------------------------------------------------------

## 2. Visual Direction

Create a modern, minimal, professional workspace.

-   Light theme as the default.
-   Warm-neutral or very light grey application background.
-   White content surfaces.
-   Dark navy/charcoal text.
-   Blue primary actions.
-   Teal as a restrained secondary accent.
-   Green for completed states.
-   Amber for waiting and caution.
-   Red for overdue and urgent states.
-   Avoid gradients, glassmorphism, oversized illustrations, and
    unnecessary animation.
-   Avoid oversized KPI cards or excessive rounded pills.
-   Use a small number of consistent corner radii and shadow levels.

The application is a tool, not a promotional landing page. Optimize for
frequent use, legibility, and speed.

------------------------------------------------------------------------

## 3. Design Tokens

Use CSS variables so the design can be adjusted centrally. The following
values are starting points; keep all components consistent with them.

### 3.1 Colour tokens

``` css
:root {
  --background: #F6F8FB;
  --surface: #FFFFFF;
  --surface-subtle: #F1F5F9;
  --surface-hover: #F8FAFC;

  --text-primary: #172B4D;
  --text-secondary: #52637A;
  --text-muted: #738198;

  --border: #DCE3EC;
  --border-strong: #C5D0DE;

  --primary: #2563EB;
  --primary-hover: #1D4ED8;
  --primary-subtle: #EFF6FF;

  --teal: #0F766E;
  --teal-subtle: #F0FDFA;

  --success: #15803D;
  --success-bg: #DCFCE7;
  --success-border: #86EFAC;

  --warning: #A16207;
  --warning-bg: #FEF3C7;
  --warning-border: #FCD34D;

  --danger: #B91C1C;
  --danger-bg: #FEE2E2;
  --danger-border: #FCA5A5;

  --info: #1D4ED8;
  --info-bg: #DBEAFE;
  --info-border: #93C5FD;

  --neutral-badge: #475569;
  --neutral-badge-bg: #E2E8F0;
}
```

Do not hardcode slightly different versions of the same colour in
different components. Reuse the tokens.

### 3.2 Status mapping

  -----------------------------------------------------------------------
  State             Background        Text              Intended meaning
  ----------------- ----------------- ----------------- -----------------
  Planned           `#E2E8F0`         `#334155`         Scheduled work

  In Progress       `#DBEAFE`         `#1D4ED8`         Work has started

  Waiting           `#FEF3C7`         `#92400E`         Waiting for a
                                                        response or
                                                        dependency

  Completed         `#DCFCE7`         `#166534`         Finished work

  Overdue           `#FEE2E2`         `#991B1B`         Deadline passed
                                                        and task is not
                                                        completed
  -----------------------------------------------------------------------

**Important:** Overdue is a derived condition, not a separate task
status. A task can be Waiting and Overdue at the same time. Display the
status badge and a separate overdue indicator or label. Completed tasks
must not be shown as overdue.

### 3.3 Priority mapping

  Priority   Visual treatment
  ---------- ----------------------------------
  High       Red text or subtle red badge
  Medium     Amber text or subtle amber badge
  Low        Neutral or green-neutral badge

Priority colours should be less visually dominant than the task title.
Reserve strong red row emphasis for genuinely overdue tasks.

### 3.4 Typography

Use a clean UI font such as Inter or the system sans-serif stack.

Suggested scale: - Page title: 24--28px, weight 650--700 - Section
title: 16--18px, weight 600 - Card value: 24--28px, weight 650 - Table
text: 13--14px, weight 400 - Table headers: 12px, weight 600 - Labels:
12--13px, weight 500 - Helper text: 12--13px - Body text: 14px,
line-height around 1.5

Do not use large display typography inside productivity tables.

### 3.5 Spacing

Use a consistent 4px-based scale: - 4px: icon/text gap - 8px: compact
control spacing - 12px: field spacing - 16px: standard component
padding - 20px: card padding - 24px: section spacing - 32px: major page
section spacing

Avoid inconsistent gaps created by arbitrary one-off values.

### 3.6 Radius and shadows

-   Small controls: 6--8px radius
-   Inputs and buttons: 8px radius
-   Cards and panels: 10--12px radius
-   Dialogs: 12--16px radius
-   Borders should do most of the visual work.
-   Use subtle shadows for overlays and dialogs, not every table or
    card.

------------------------------------------------------------------------

## 4. Application Shell

### 4.1 Desktop layout

Use a fixed-width or collapsible left sidebar and a flexible main
content area.

Recommended dimensions: - Sidebar: 232--248px expanded - Collapsed
sidebar: approximately 64--72px - Main page padding: 28--32px on wide
screens, 20--24px on medium screens - Maximum content width: around
1440px - Main content should use available space rather than staying
unnecessarily narrow.

### 4.2 Sidebar content

Top: - Small app mark/icon - Product name: **Personal PM Tracker**

Navigation: - Dashboard - Daily Planner - Task History - Projects -
Reports - Settings

Bottom: - User avatar or initials - Account name - Sign out action in a
menu

Use a clear active navigation state with a pale-blue background or left
indicator. Icons should be simple Lucide icons with consistent size,
normally 18--20px.

Do not add counts to every navigation item. Only show a count when it
provides real value, such as overdue tasks.

### 4.3 Main page header

Each page should have: - Page title - Short, useful subtitle - Optional
breadcrumb when needed - One primary action when appropriate

Example: - Title: **Daily Planner** - Subtitle: "Plan your work, update
progress, and keep deadlines visible." - Primary button: **+ Add Task**

Keep the header compact.

### 4.4 Responsive navigation

-   Desktop: persistent sidebar.
-   Tablet: collapsible sidebar.
-   Mobile: navigation drawer or compact menu.
-   Ensure page title and primary action remain accessible.
-   Avoid horizontal overflow caused by the sidebar plus content.

------------------------------------------------------------------------

## 5. Dashboard Design

### 5.1 Layout

Suggested vertical order: 1. Header and current date 2. Compact KPI grid
3. Today's Tasks and Needs Attention tables 4. Optional small weekly
completion summary, only if it adds value

Do not place a large chart above the task lists. The user needs
actionable tasks before analytics.

### 5.2 KPI cards

Use a responsive grid: - Wide desktop: 4 cards per row, 2 rows - Medium:
2--3 cards per row depending on available width - Mobile: 2 cards per
row where readable, otherwise one column

Each card contains: - Small label - Prominent value - Optional small
icon - Optional short contextual caption

Keep cards compact: approximately 84--112px high, depending on viewport.
Avoid huge illustrations, progress rings, and decorative gradients.

Use consistent card sizing. Red may be used for the Overdue value or
subtle accent, but do not colour every card strongly.

KPI cards: - Today's Tasks - Open Tasks - In Progress - High Priority -
Overdue - Waiting - Completed This Week - Upcoming

A KPI should be clickable only if it opens the corresponding filtered
list. Otherwise present it as a non-interactive statistic.

### 5.3 Today's Tasks table

Place this as a primary content section directly under KPI cards.

Columns: - Client / Project - Task / Activity - Priority - Status -
Deadline

Visual priorities: - Task title is the strongest text. - Project name
uses secondary text. - Status is a labelled badge. - Deadline is
formatted clearly (e.g. `11 Oct` or `11 Oct 2026`, depending on
context). - Overdue deadlines have a red label/icon as well as readable
text.

Use a comfortable row height around 52--60px. Long task titles may wrap
to two lines or truncate with a detail view; never let one title stretch
the whole dashboard.

### 5.4 Needs Attention table

Show this beside Today's Tasks on wide screens if both remain readable;
otherwise stack vertically.

Use the same table language as Today's Tasks. Make the reason
explicit: - Overdue - High priority - Waiting for response

A task that matches more than one condition should appear once with
multiple concise reason tags, not multiple duplicate rows.

### 5.5 Empty states

Examples: - "No tasks planned for today." - "Nothing needs your
attention right now." - Add a useful CTA such as **Plan a task** where
appropriate.

Empty states should be compact and calm, not giant illustrations.

### 5.6 Loading and errors

Use skeletons matching the actual layout. If one section fails to load,
show an error within that section and a retry action. Do not replace the
whole page with a blank screen if a small part fails.

------------------------------------------------------------------------

## 6. Daily Planner Design

### 6.1 Page structure

Top: - Title and subtitle - Primary **Add Task** button

Below: - Search input - Filters for project, status, priority, and
planned date - Optional overdue-only toggle - Sort control - Clear
filters action

Then: - Compact result count - Active tasks table - Pagination or
bounded loading

### 6.2 Task table columns

Default columns: 1. Planned Date 2. Client / Project 3. Task / Activity
4. Category 5. Priority 6. Status 7. Deadline 8. Actions

Notes should be visible in the task detail view rather than occupying a
very wide table column. Do not display internal UUIDs.

Use: - Sticky header if useful - Row hover background - Clear focus
styles - Consistent alignment - Ellipsis for overflow where necessary,
with accessible details available - A small action menu for Edit, View
Details, Complete, and Archive/Delete where supported

Avoid turning every cell into an input. Use a clear edit dialog or
detail drawer for reliable updates.

### 6.3 Row visual behaviour

-   Normal row: white background with subtle divider
-   Hover: very light neutral background
-   Planned: neutral/blue status badge
-   In Progress: blue badge
-   Waiting: amber badge
-   Completed: green badge, generally hidden from the active planner
-   Overdue: subtle red left border or deadline emphasis, plus an
    "Overdue" label
-   High priority: subtle red priority badge

Do not fill every overdue row with an intense red background if it
reduces text readability. Prefer a red left accent, badge, and deadline
treatment.

### 6.4 Filters

Filters must be visually compact and have clear labels or accessible
placeholders. Show active filters and provide a one-click way to clear
them.

On mobile, move filters into a popover or filter drawer. Show a count of
active filters.

### 6.5 Add/Edit Task dialog

Use a dialog or right-side drawer. Keep it short and grouped logically.

**Section: Task** - Task / Activity --- required - Client / Project ---
searchable select - Category --- select

**Section: Planning** - Planned Date --- required, default today -
Deadline --- optional - Priority --- High / Medium / Low - Status ---
Planned / In Progress / Waiting / Completed

**Section: Notes** - Notes / Next Step --- optional textarea

Actions: - Cancel - Save Task / Save Changes

Form requirements: - Clear required markers - Inline validation errors -
Prevent duplicate submissions - Loading state while saving - Keep
user-entered data if save fails - Close only after successful save or
explicit cancel - Ask for confirmation before discarding meaningful
unsaved changes

### 6.6 Task completion interaction

When user selects Complete: - If completion is a one-click action, show
a small confirmation or provide an undo toast only if the operation can
be reliably reversed. - Persist completion on the server. - Set a fixed
completion timestamp. - Remove the task from the active list after the
server confirms success. - Show a success toast: "Task moved to Task
History." - Refresh dashboard counts and lists. - If the request fails,
keep the task visible and show an error. - Never hide a task
optimistically without rollback/error handling.

------------------------------------------------------------------------

## 7. Task History Design

### 7.1 Purpose

Task History is a searchable archive view of completed tasks, not a
second manually maintained task table.

### 7.2 Layout

Header: - Title: **Task History** - Subtitle: "Review completed work and
track what you have delivered." - Optional **Export CSV** button

Filters: - Search - Project - Completion date range - Category -
Priority

Table columns: - Completed Date - Client / Project - Task / Activity -
Category - Priority - Planned Date - Deadline - Actions

Display completed date prominently. Show outcome/notes in the detail
drawer rather than adding a wide Notes column by default.

### 7.3 Reopening tasks

If the user reopens a completed task: - Confirm if necessary. - Return
the task to Daily Planner after the operation succeeds. - Preserve prior
completion/reopening events in the activity timeline. - Do not erase
previous history events. - Show a success message.

### 7.4 Empty state

"No completed tasks yet. Completed tasks will appear here
automatically."

------------------------------------------------------------------------

## 8. Projects Design

### 8.1 Project list

Page header: - Title: **Projects** - Subtitle: "Keep your client
projects organised." - Primary button: **+ Add Project**

Include search and filters for Active, On Hold, Completed, and Archived.

Each project card or table row should show: - Project Name - Client
Name - Status - Active task count - Overdue task count - Target end
date, if present

Use a table on desktop if there are many projects; cards may be used on
narrow screens.

### 8.2 Project create/edit form

Fields: - Project Name --- required - Client Name --- optional -
Description --- optional - Status - Start Date --- optional - Target End
Date --- optional - Notes --- optional

### 8.3 Project detail view

Show: - Project name and client - Project status - Key dates - Active
tasks associated with the project - Completed task count - Overdue task
count - Optional recent activity

Keep project details lightweight. Do not build Gantt charts or resource
planning in the MVP.

------------------------------------------------------------------------

## 9. Reports Design

### 9.1 Report page structure

Header: - Title: **Reports** - Subtitle: "Review your work and prepare
weekly updates."

Controls: - This Week - Last Week - This Month - Custom Date Range -
Export CSV

### 9.2 Summary cards

Show: - Tasks completed during selected period - Tasks still open -
Tasks overdue - Tasks waiting for others

### 9.3 Completed work report

Table: - Completed Date - Client / Project - Task / Activity -
Category - Priority - Outcome / Notes

Group by project only if it improves readability. Avoid large charts
that do not support a reporting decision.

### 9.4 CSV export

-   Export only records matching current filters/date range.
-   Use human-readable column names.
-   Escape commas, quotes, and line breaks correctly.
-   Do not export internal secrets or unrelated user records.
-   Name files clearly, for example `pm-completed-work-2026-10-11.csv`.

------------------------------------------------------------------------

## 10. Settings and Authentication UI

### Login page

-   Simple, focused layout
-   Product name and short purpose statement
-   Email/password or configured Supabase-supported sign-in method
-   Clear validation and authentication errors
-   Loading state
-   No unnecessary marketing content

### Settings page

MVP settings: - Display name - Timezone - Date format if implemented
consistently - Sign out - Short privacy/data note

Use explicit labels and save feedback. Do not add multi-user
organization administration.

### Session handling

-   Show a loading state while the session is checked.
-   Redirect unauthenticated users to login.
-   Handle expired sessions with a clear message.
-   Do not briefly show protected data before authentication is
    resolved.

------------------------------------------------------------------------

## 11. Reusable Component Inventory

Create reusable components with consistent styling:

### Layout

-   `AppShell`
-   `Sidebar`
-   `MobileNavigation`
-   `PageHeader`
-   `UserMenu`

### Dashboard

-   `KpiCard`
-   `KpiGrid`
-   `TodayTasksTable`
-   `NeedsAttentionTable`
-   `DashboardSection`

### Tasks

-   `TaskTable`
-   `TaskRow`
-   `TaskStatusBadge`
-   `PriorityBadge`
-   `OverdueIndicator`
-   `TaskFilters`
-   `TaskForm`
-   `TaskDialog` or `TaskDrawer`
-   `TaskDetails`
-   `TaskActivityTimeline`
-   `EmptyState`
-   `DeleteConfirmDialog`

### Projects

-   `ProjectTable` or `ProjectCard`
-   `ProjectForm`
-   `ProjectStatusBadge`
-   `ProjectSummary`

### Reports

-   `ReportDateRange`
-   `ReportSummaryCards`
-   `CompletedWorkTable`
-   `ExportCsvButton`

Use shadcn/ui primitives where useful, but avoid excessive abstraction.
A component should be reusable because it has a real shared
responsibility, not merely because it exists on one page.

------------------------------------------------------------------------

## 12. Interaction and Motion

Keep animation subtle and functional: - Short hover transitions - Small
dialog fade/scale transition - Sidebar expand/collapse transition -
Toast notifications - Skeleton loading

Avoid: - Scroll-triggered storytelling - Large page entrance
animations - Bouncy transitions - Animated KPI numbers that delay
comprehension - Motion that makes repeated daily work slower

Respect reduced-motion preferences.

------------------------------------------------------------------------

## 13. Responsive Behaviour

### Desktop

-   Full sidebar
-   KPI cards in four columns
-   Tables use available width
-   Today's Tasks and Needs Attention may be side by side if legible

### Tablet

-   Collapsible sidebar
-   KPI grid in two or three columns
-   Task tables retain key columns, with secondary information in
    details

### Mobile

-   Compact navigation drawer
-   KPI cards in two columns if legible
-   Add Task action easy to reach
-   Task list may switch to cards
-   Filters move into a drawer
-   Avoid tiny buttons and inaccessible hover-only actions
-   Keep status and deadline visible without opening every task
-   Forms should use full-width fields and appropriate mobile input
    types

Test at approximately 375px, 768px, 1024px, and 1440px widths.

------------------------------------------------------------------------

## 14. Accessibility and Usability Checklist

-   [ ] All inputs have visible labels
-   [ ] Keyboard focus is always visible
-   [ ] Dialogs trap focus and return focus appropriately
-   [ ] Buttons have descriptive names
-   [ ] Status and priority are readable as text
-   [ ] Colour contrast meets WCAG AA where practical
-   [ ] Errors are connected to the relevant fields
-   [ ] Tables have semantic headers
-   [ ] No action requires hover alone
-   [ ] Reduced motion is respected
-   [ ] Responsive layouts have no unintended horizontal overflow
-   [ ] Long task and project names remain usable

------------------------------------------------------------------------

## 15. Design Acceptance Criteria

The design is accepted when:

1.  A user can identify today's work and urgent tasks quickly.
2.  Dashboard KPI cards are compact and visually consistent.
3.  Task lists are easier to scan than to read line by line.
4.  Status and priority are clearly distinguished.
5.  Overdue tasks are noticeable without making the entire UI look
    alarming.
6.  Adding or editing a task feels quick and straightforward.
7.  Completed tasks are presented in Task History, not mixed into active
    tasks.
8.  Project selection is consistent across the application.
9.  Reports are readable and suitable for weekly work reviews.
10. The UI works on desktop, tablet, and mobile.
11. Loading, empty, error, and success states are designed.
12. The interface avoids unnecessary charts, decorative gradients, and
    oversized elements.

------------------------------------------------------------------------

## 16. Final Instructions to the Coding Agent

Use this document as the design authority for the Personal PM Tracker.

First inspect the repository and its existing UI. Then implement the
design using reusable components and centralised design tokens. Keep the
interface calm, professional, compact, and action-oriented.

Prioritize the following user journey:

**Open Dashboard → Identify today's and urgent tasks → Update work in
Daily Planner → Complete a task → See it in Task History → Review
completed work in Reports.**

Do not treat a polished screenshot as completion. Every control that
appears interactive must perform a real, appropriate action. Data-driven
states must be connected to the application logic described in
`trackerprompt.md`.

When the design is complete, test all main routes at desktop and mobile
sizes, verify accessibility basics, and report any design or
implementation gaps honestly.
