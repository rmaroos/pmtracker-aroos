import Link from "next/link";
import { ArrowRight, CalendarCheck2, CircleAlert, Clock3, ListTodo, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { currentWeekRange, isOverdue, sortUrgency, todayISO, formatDate } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { Deadline, EmptyState, PriorityBadge, StatusBadge } from "@/components/ui";
import { PageHeader } from "@/components/app-shell";
export default async function DashboardPage() {
 const supabase = await createClient(); const today = todayISO(); const week = currentWeekRange();
 const [activeRes, doneRes] = await Promise.all([supabase.from("tasks").select("*, projects(name,client_name)").is("deleted_at", null).neq("status", "Completed").order("planned_date"), supabase.from("tasks").select("id, completed_at").is("deleted_at", null).eq("status", "Completed").gte("completed_at", week.from + "T00:00:00").lte("completed_at", week.to + "T23:59:59")]);
 if (activeRes.error || doneRes.error) throw new Error("Dashboard data could not be loaded."); const tasks = (activeRes.data || []) as unknown as Task[]; const todayTasks = sortUrgency(tasks.filter(t => t.planned_date === today)); const attention = sortUrgency(tasks.filter(t => isOverdue(t, today) || t.priority === "High" || t.status === "Waiting")).slice(0, 7);
 const upcoming = tasks.filter(t => t.planned_date >= today && t.planned_date <= new Date(Date.now() + 7 * 86400000).toISOString().slice(0,10)).length;
 const kpis = [
  { label: "Today's tasks", value: todayTasks.length, icon: CalendarCheck2, tone: "blue", href: "/planner?planned=today" },
  { label: "Open tasks", value: tasks.length, icon: ListTodo, tone: "", href: "/planner" },
  { label: "In progress", value: tasks.filter(t => t.status === "In Progress").length, icon: TrendingUp, tone: "blue", href: "/planner?status=In+Progress" },
  { label: "High priority", value: tasks.filter(t => t.priority === "High").length, icon: CircleAlert, tone: "danger", href: "/planner?priority=High" },
  { label: "Overdue", value: tasks.filter(t => isOverdue(t, today)).length, icon: CircleAlert, tone: "danger", href: "/planner?overdue=1" },
  { label: "Waiting", value: tasks.filter(t => t.status === "Waiting").length, icon: Clock3, tone: "warning", href: "/planner?status=Waiting" },
  { label: "Completed this week", value: doneRes.data?.length || 0, icon: CalendarCheck2, tone: "green", href: "/history" },
  { label: "Upcoming · 7 days", value: upcoming, icon: Clock3, tone: "", href: "/planner?planned=upcoming" }
 ];
 return (
  <>
    <PageHeader
      title="Dashboard"
      description={formatDate(today, "EEEE, d MMMM yyyy") + " · Here’s what needs your attention."}
      action={
        <Link href="/planner/new" className="button primary">
          <span>＋</span> Add task
        </Link>
      }
    />
    <div className="page-content">
      <div className="kpi-grid">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Link
              href={k.href}
              key={k.label}
              className={"kpi " + (k.tone ? "kpi-" + k.tone : "")}
            >
              <div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value">{k.value}</div>
              </div>
              <span className="kpi-icon">
                <Icon size={15} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-head">
            <div className="section-title">
              <div>
                <h2>Today’s tasks</h2>
                <p>Your planned work for today</p>
              </div>
              <Link href="/planner?planned=today">
                View planner <ArrowRight size={12} />
              </Link>
            </div>
          </div>
          <div className="panel-body">
            {todayTasks.length ? (
              <div className="tasks-container">
                {/* Mobile Cards for Dashboard */}
                <div className="mobile-task-cards">
                  {todayTasks.slice(0, 7).map((t) => (
                    <div
                      key={t.id}
                      className={`mobile-task-card ${isOverdue(t) ? "card-overdue" : ""}`}
                    >
                      <div className="card-top-row">
                        <span className="card-project-pill">
                          {t.projects?.name || "Unassigned"}
                        </span>
                        <div className="card-badge-group">
                          <PriorityBadge priority={t.priority} />
                          <StatusBadge status={t.status} />
                        </div>
                      </div>
                      <div className="card-middle">
                        <Link className="card-task-title" href={"/planner/" + t.id}>
                          <span>{t.title}</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                      <div className="card-bottom-row">
                        <Deadline task={t} />
                        <Link className="button text small" href={"/planner/" + t.id}>
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="table-wrap desktop-table-only">
                  <table>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Task / Activity</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayTasks.slice(0, 7).map((t) => (
                        <tr key={t.id}>
                          <td className="project-cell">
                            {t.projects?.name || <span className="muted">Unassigned</span>}
                          </td>
                          <td>
                            <Link className="task-title" href={"/planner/" + t.id}>
                              {t.title}
                            </Link>
                          </td>
                          <td>
                            <PriorityBadge priority={t.priority} />
                          </td>
                          <td>
                            <StatusBadge status={t.status} />
                          </td>
                          <td>
                            <Deadline task={t} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No tasks planned for today"
                detail="Add a task or schedule work in your planner."
                href="/planner/new"
                action="Plan a task"
              />
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div className="section-title">
              <div>
                <h2>Needs attention</h2>
                <p>Overdue, high priority, or waiting</p>
              </div>
              <Link href="/planner?attention=1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
          </div>
          <div className="panel-body">
            {attention.length ? (
              <div className="attention-list">
                {attention.map((t) => (
                  <Link
                    href={"/planner/" + t.id}
                    key={t.id}
                    className="attention-row"
                  >
                    <span
                      className={
                        isOverdue(t)
                          ? "attention-mark red"
                          : t.status === "Waiting"
                          ? "attention-mark amber"
                          : "attention-mark blue"
                      }
                    />
                    <span className="attention-copy">
                      <b>{t.title}</b>
                      <small>
                        {t.projects?.name || "Unassigned"} ·{" "}
                        {isOverdue(t)
                          ? "Overdue"
                          : t.status === "Waiting"
                          ? "Waiting for response"
                          : "High priority"}
                      </small>
                    </span>
                    <Deadline task={t} />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nothing needs your attention"
                detail="You’re up to date on urgent work."
              />
            )}
          </div>
        </section>
      </div>
    </div>
  </>
);
}

