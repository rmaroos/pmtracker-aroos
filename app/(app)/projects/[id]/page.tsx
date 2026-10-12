import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app-shell";
import { ProjectForm } from "@/components/project-form";
import { DeleteButton } from "@/components/delete-button";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { deleteProject } from "@/lib/actions";
import type { Project } from "@/lib/types";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [projectRes, tasksCountRes] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("project_id", id)
      .is("deleted_at", null),
  ]);

  if (projectRes.error || !projectRes.data) notFound();
  const p = projectRes.data as unknown as Project;
  const taskCount = tasksCountRes.count || 0;

  return (
    <>
      <PageHeader
        title="Project details"
        description="Keep the project record current; related tasks stay linked."
        action={
          <DeleteButton
            id={p.id}
            title={p.name}
            itemType="project"
            action={deleteProject}
            redirectTo="/projects?deleted=1"
            extraInfo={
              taskCount > 0
                ? `This project has ${taskCount} associated task${
                    taskCount > 1 ? "s" : ""
                  }. Deleting it will unassign those tasks.`
                : undefined
            }
            variant="danger-outline"
          />
        }
      />
      <div className="page-content content-narrow">
        <div className="notice-strip">
          Created {formatDate(p.created_at)}
          {p.target_end_date ? " · Target end " + formatDate(p.target_end_date) : ""}
        </div>
        <ProjectForm project={p} />
      </div>
    </>
  );
}
