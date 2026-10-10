import Link from "next/link";
import { ArrowUpRight, Calendar, Pencil, RotateCcw } from "lucide-react";
import { formatDate, isOverdue } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { Deadline, PriorityBadge, StatusBadge, EmptyState } from "@/components/ui";
import { setTaskStatus } from "@/lib/actions";

export function TaskTable({ tasks, history = false }: { tasks: Task[]; history?: boolean }) {
  if (!tasks.length) {
    return (
      <EmptyState
        title={history ? "No completed work yet" : "No tasks match this view"}
        detail={
          history
            ? "Completed tasks will appear here automatically."
            : "Try changing the filters, or add a task to your planner."
        }
        href={history ? undefined : "/planner/new"}
        action={history ? undefined : "Add task"}
      />
    );
  }

  return (
    <div className="tasks-container">
      {/* Mobile Card View */}
      <div className="mobile-task-cards">
        {tasks.map((task) => {
          const overdue = isOverdue(task);
          return (
            <div
              key={task.id}
              className={`mobile-task-card ${overdue ? "card-overdue" : ""}`}
            >
              <div className="card-top-row">
                <span className="card-project-pill">
                  {task.projects?.client_name ? `${task.projects.client_name} · ` : ""}
                  {task.projects?.name || "Unassigned"}
                </span>
                <div className="card-badge-group">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>

              <div className="card-middle">
                <Link className="card-task-title" href={"/planner/" + task.id}>
                  <span>{task.title}</span>
                  <ArrowUpRight size={14} />
                </Link>
                {task.category ? (
                  <span className="card-task-category">{task.category}</span>
                ) : null}
              </div>

              <div className="card-bottom-row">
                <div className="card-meta">
                  <span className="card-date-item">
                    <Calendar size={13} />
                    {history
                      ? `Done ${formatDate(task.completed_at, "d MMM")}`
                      : formatDate(task.planned_date, "d MMM")}
                  </span>
                  <Deadline task={task} />
                </div>
                <div className="card-action">
                  {history ? (
                    <form action={setTaskStatus}>
                      <input type="hidden" name="id" value={task.id} />
                      <input type="hidden" name="status" value="Planned" />
                      <button className="button secondary small" type="submit">
                        <RotateCcw size={12} /> Reopen
                      </button>
                    </form>
                  ) : (
                    <Link
                      className="icon-button"
                      aria-label="Edit task"
                      href={"/planner/" + task.id}
                    >
                      <Pencil size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="table-wrap desktop-table-only">
        <table>
          <thead>
            <tr>
              {history ? <th>Completed</th> : <th>Planned</th>}
              <th>Project</th>
              <th>Task / Activity</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Deadline</th>
              <th className="actions-col">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className={isOverdue(task) ? "row-overdue" : ""}>
                <td className="date-cell">
                  {history
                    ? formatDate(task.completed_at, "d MMM yyyy")
                    : formatDate(task.planned_date, "d MMM yyyy")}
                </td>
                <td>
                  <span className="project-cell">
                    {task.projects?.client_name ? (
                      <small>{task.projects.client_name}</small>
                    ) : null}
                    {task.projects?.name || <span className="muted">Unassigned</span>}
                  </span>
                </td>
                <td>
                  <Link className="task-title" href={"/planner/" + task.id}>
                    {task.title}
                    <ArrowUpRight size={13} />
                  </Link>
                  <small className="task-category">{task.category}</small>
                </td>
                <td>
                  <PriorityBadge priority={task.priority} />
                </td>
                <td>
                  <StatusBadge status={task.status} />
                </td>
                <td>
                  <Deadline task={task} />
                </td>
                <td className="actions-col">
                  {history ? (
                    <form action={setTaskStatus}>
                      <input type="hidden" name="id" value={task.id} />
                      <input type="hidden" name="status" value="Planned" />
                      <button className="button text small" type="submit">
                        Reopen
                      </button>
                    </form>
                  ) : (
                    <Link
                      className="icon-button"
                      aria-label="Edit task"
                      href={"/planner/" + task.id}
                    >
                      <Pencil size={15} />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

