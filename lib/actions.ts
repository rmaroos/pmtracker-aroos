"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, PRIORITIES, PROJECT_STATUSES, TASK_STATUSES } from "@/lib/types";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}
const taskSchema = z.object({ title: z.string().trim().min(1).max(240), category: z.enum(CATEGORIES), priority: z.enum(PRIORITIES), status: z.enum(TASK_STATUSES), planned_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), deadline: z.string().optional(), notes: z.string().max(5000).optional(), project_id: z.string().optional() });
const projectSchema = z.object({ name: z.string().trim().min(1).max(160), client_name: z.string().max(160).optional(), description: z.string().max(3000).optional(), status: z.enum(PROJECT_STATUSES), start_date: z.string().optional(), target_end_date: z.string().optional(), notes: z.string().max(5000).optional() });
function getTaskInput(formData: FormData) {
  return taskSchema.safeParse({ title: formData.get("title"), category: formData.get("category"), priority: formData.get("priority"), status: formData.get("status"), planned_date: formData.get("planned_date"), deadline: formData.get("deadline") || "", notes: formData.get("notes") || "", project_id: formData.get("project_id") || "" });
}
function cleanTask(input: z.infer<typeof taskSchema>) { return { title: input.title, category: input.category, priority: input.priority, status: input.status, planned_date: input.planned_date, deadline: input.deadline || null, notes: input.notes || null, project_id: input.project_id || null }; }
export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || ""); const password = String(formData.get("password") || "");
  const supabase = await createClient(); const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=signin"); revalidatePath("/", "layout"); redirect("/dashboard");
}
export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); revalidatePath("/", "layout"); redirect("/login"); }
export async function createTask(formData: FormData) {
  const parsed = getTaskInput(formData); if (!parsed.success) redirect("/planner/new?error=validation");
  const { supabase, user } = await requireUser(); const values = cleanTask(parsed.data);
  const { error } = await supabase.from("tasks").insert({ ...values, user_id: user.id, completed_at: values.status === "Completed" ? new Date().toISOString() : null });
  if (error) redirect("/planner/new?error=save"); revalidatePath("/", "layout"); redirect("/planner?saved=1");
}
export async function updateTask(formData: FormData) {
  const id = String(formData.get("id") || ""); const parsed = getTaskInput(formData); if (!id || !parsed.success) redirect("/planner?error=validation");
  const { supabase, user } = await requireUser(); const values = cleanTask(parsed.data);
  if (values.status !== "Completed") { const { error } = await supabase.from("tasks").update(values).eq("id", id).eq("user_id", user.id); if (error) redirect("/planner?error=save"); }
  else { const { error } = await supabase.from("tasks").update(values).eq("id", id).eq("user_id", user.id); if (error) redirect("/planner?error=save"); }
  revalidatePath("/", "layout"); redirect("/planner?saved=1");
}
export async function setTaskStatus(formData: FormData) {
  const id = String(formData.get("id") || ""); const status = String(formData.get("status") || "");
  if (!TASK_STATUSES.includes(status as (typeof TASK_STATUSES)[number])) redirect("/planner?error=validation");
  const { supabase } = await requireUser(); const { error } = await supabase.rpc("set_task_status", { p_task_id: id, p_status: status });
  if (error) redirect("/planner?error=save"); revalidatePath("/", "layout"); redirect(status === "Completed" ? "/history?completed=1" : "/planner?saved=1");
}
export async function createProject(formData: FormData) {
  const parsed = projectSchema.safeParse({ name: formData.get("name"), client_name: formData.get("client_name") || "", description: formData.get("description") || "", status: formData.get("status"), start_date: formData.get("start_date") || "", target_end_date: formData.get("target_end_date") || "", notes: formData.get("notes") || "" });
  if (!parsed.success) redirect("/projects/new?error=validation"); const { supabase, user } = await requireUser(); const p = parsed.data;
  const { error } = await supabase.from("projects").insert({ user_id: user.id, name: p.name, client_name: p.client_name || null, description: p.description || null, status: p.status, start_date: p.start_date || null, target_end_date: p.target_end_date || null, notes: p.notes || null });
  if (error) redirect("/projects/new?error=save"); revalidatePath("/", "layout"); redirect("/projects?saved=1");
}
export async function updateProject(formData: FormData) {
  const id = String(formData.get("id") || ""); const parsed = projectSchema.safeParse({ name: formData.get("name"), client_name: formData.get("client_name") || "", description: formData.get("description") || "", status: formData.get("status"), start_date: formData.get("start_date") || "", target_end_date: formData.get("target_end_date") || "", notes: formData.get("notes") || "" });
  if (!id || !parsed.success) redirect("/projects?error=validation"); const { supabase, user } = await requireUser(); const p = parsed.data;
  const { error } = await supabase.from("projects").update({ name: p.name, client_name: p.client_name || null, description: p.description || null, status: p.status, start_date: p.start_date || null, target_end_date: p.target_end_date || null, notes: p.notes || null }).eq("id", id).eq("user_id", user.id);
  if (error) redirect("/projects?error=save"); revalidatePath("/", "layout"); redirect("/projects?saved=1");
}
export async function saveSettings(formData: FormData) {
  const displayName = String(formData.get("display_name") || "").trim().slice(0, 120); const timezone = String(formData.get("timezone") || "Asia/Colombo");
  const validTimezone = (() => { try { Intl.DateTimeFormat(undefined, { timeZone: timezone }); return true; } catch { return false; } })();
  if (!validTimezone) redirect("/settings?error=timezone"); const { supabase, user } = await requireUser();
  const { error } = await supabase.from("profiles").upsert({ id: user.id, display_name: displayName || null, timezone, updated_at: new Date().toISOString() });
  if (error) redirect("/settings?error=save"); revalidatePath("/", "layout"); redirect("/settings?saved=1");
}

export async function deleteTask(formData: FormData) {
  const id = String(formData.get("id") || "");
  const redirectTo = String(formData.get("redirectTo") || "/planner?deleted=1");
  if (!id) redirect("/planner?error=validation");

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    const fallback = redirectTo.startsWith("/") ? redirectTo : "/planner";
    redirect(fallback + (fallback.includes("?") ? "&" : "?") + "error=delete");
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id") || "");
  const redirectTo = String(formData.get("redirectTo") || "/projects?deleted=1");
  if (!id) redirect("/projects?error=validation");

  const { supabase, user } = await requireUser();

  // Unlink associated tasks before deleting project so foreign keys and RLS allow deletion
  const { error: unassignError } = await supabase
    .from("tasks")
    .update({ project_id: null })
    .eq("project_id", id)
    .eq("user_id", user.id);

  if (unassignError) {
    redirect("/projects?error=delete");
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect("/projects?error=delete");
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
