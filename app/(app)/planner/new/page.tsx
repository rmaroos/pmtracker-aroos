import { PageHeader } from "@/components/app-shell";
import { TaskForm } from "@/components/task-form";
import { FormNotice } from "@/components/form-error";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
export default async function NewTaskPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const supabase = await createClient(); const { data } = await supabase.from("projects").select("*").neq("status","Archived").order("name"); const params = await searchParams; return <><PageHeader title="Add task" description="Capture the next action and keep the details in one place."/><div className="page-content content-narrow"><FormNotice error={params.error}/><TaskForm projects={(data||[]) as unknown as Project[]}/></div></>; }
