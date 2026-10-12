import { createTask, updateTask, deleteTask } from "@/lib/actions";
import { CATEGORIES, PRIORITIES, TASK_STATUSES, type Project, type Task } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import { DeleteButton } from "@/components/delete-button";

export function TaskForm({ projects, task }: { projects: Project[]; task?: Task }) {
  const action = task ? updateTask : createTask;
  return (
    <form action={action} className="form-card">
      {task ? <input type="hidden" name="id" value={task.id} /> : null}
      <div className="form-section">
        <p className="section-eyebrow">TASK DETAILS</p>
        <div className="field-grid">
          <label className="span-2">
            Task / Activity <em>*</em>
            <input
              name="title"
              required
              maxLength={240}
              defaultValue={task?.title || ""}
              placeholder="e.g. Follow up on pending client approval"
            />
          </label>
          <label>
            Project
            <select name="project_id" defaultValue={task?.project_id || ""}>
              <option value="">Unassigned</option>
              {projects
                .filter((p) => p.status !== "Archived")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.client_name ? p.client_name + " · " : ""}
                    {p.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Category
            <select name="category" defaultValue={task?.category || "Project Planning"}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select name="priority" defaultValue={task?.priority || "Medium"}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select name="status" defaultValue={task?.status || "Planned"}>
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Planned date <em>*</em>
            <input
              type="date"
              name="planned_date"
              required
              defaultValue={task?.planned_date || todayISO()}
            />
          </label>
          <label>
            Deadline
            <input type="date" name="deadline" defaultValue={task?.deadline || ""} />
          </label>
          <label className="span-2">
            Notes / Next step
            <textarea
              name="notes"
              rows={4}
              maxLength={5000}
              defaultValue={task?.notes || ""}
              placeholder="Context, blocker, follow-up, or next action"
            />
          </label>
        </div>
      </div>
      <div className={`form-footer ${task ? "form-footer-between" : ""}`}>
        {task ? (
          <DeleteButton
            id={task.id}
            title={task.title}
            itemType="task"
            action={deleteTask}
            redirectTo="/planner?deleted=1"
            variant="button"
          />
        ) : null}
        <div className="form-footer-right">
          <a className="button secondary" href="/planner">
            Cancel
          </a>
          <button type="submit" className="button primary">
            {task ? "Save changes" : "Save task"}
          </button>
        </div>
      </div>
    </form>
  );
}
