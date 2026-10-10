import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app-shell";
import { ProjectForm } from "@/components/project-form";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/types";
export default async function ProjectPage({ params }: { params: Promise<{id:string}> }) { const {id}=await params; const supabase=await createClient(); const {data,error}=await supabase.from("projects").select("*").eq("id",id).maybeSingle(); if(error||!data) notFound(); const p=data as unknown as Project; return <><PageHeader title="Project details" description="Keep the project record current; related tasks stay linked."/><div className="page-content content-narrow"><div className="notice-strip">Created {formatDate(p.created_at)}{p.target_end_date?" · Target end "+formatDate(p.target_end_date):""}</div><ProjectForm project={p}/></div></>; }
