import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app-shell";
import { TaskForm } from "@/components/task-form";
import { DeleteButton } from "@/components/delete-button";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Project, Task } from "@/lib/types";
import { setTaskStatus, deleteTask } from "@/lib/actions";
import { StatusBadge } from "@/components/ui";

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [taskRes, projectsRes, activityRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("*, projects(name,client_name)")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase.from("projects").select("*").neq("status", "Archived").order("name"),
    supabase
      .from("task_activity")
      .select("id,event_type,summary,created_at")
      .eq("task_id", id)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  if (!taskRes.data) notFound();
  const task = taskRes.data as unknown as Task;

  return (
    <>
      <PageHeader
        title="Task details"
        description="Review the full task record, edit it, or change its status."
        action={
          <DeleteButton
            id={task.id}
            title={task.title}
            itemType="task"
            action={deleteTask}
            redirectTo="/planner?deleted=1"
            variant="danger-outline"
          />
        }
      />
      <div className="page-content content-narrow">
        <div className="panel">
          <div className="form-section">
            <div className="section-title">
              <div>
                <h2>{task.title}</h2>
                <p>
                  {task.projects?.name || "Unassigned"}
                  {task.projects?.client_name ? " · " + task.projects.client_name : ""}
                </p>
              </div>
              <StatusBadge status={task.status} />
            </div>
            <div className="detail-meta">
              <span>{task.priority} priority</span>
              <span>{task.category}</span>
              <span>Planned {formatDate(task.planned_date)}</span>
              <span>Deadline {formatDate(task.deadline)}</span>
              <span>Created {formatDate(task.created_at)}</span>
              {task.completed_at ? (
                <span>Completed {formatDate(task.completed_at)}</span>
              ) : null}
            </div>
            <p className="section-eyebrow" style={{ marginTop: 20 }}>
              NOTES / NEXT STEP
            </p>
            <div className="notes-box">{task.notes || "No notes added."}</div>
            {task.status !== "Completed" ? (
              <form action={setTaskStatus} style={{ marginTop: 14 }}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="Completed" />
                <button className="button primary" type="submit">
                  Mark complete
                </button>
              </form>
            ) : (
              <form action={setTaskStatus} style={{ marginTop: 14 }}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="Planned" />
                <button className="button secondary" type="submit">
                  Reopen task
                </button>
              </form>
            )}
          </div>
        </div>

        <section>
          <div className="form-heading">
            <h2>Edit task</h2>
            <p>Changes are recorded in the activity timeline.</p>
          </div>
          <TaskForm
            projects={(projectsRes.data || []) as unknown as Project[]}
            task={task}
          />
        </section>

        <section className="panel">
          <div className="panel-head">
            <div className="section-title">
              <div>
                <h2>Activity</h2>
                <p>Recent task changes</p>
              </div>
            </div>
          </div>
          <div className="panel-body">
            {activityRes.data?.length ? (
              activityRes.data.map((event: any) => (
                <div key={event.id} className="activity-row">
                  <b>{event.summary || event.event_type}</b>
                  <small>{formatDate(event.created_at, "d MMM yyyy · HH:mm")}</small>
                </div>
              ))
            ) : (
              <p className="muted">No activity recorded.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
