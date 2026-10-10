import { PageHeader } from "@/components/app-shell";
import { ProjectForm } from "@/components/project-form";
import { FormNotice } from "@/components/form-error";
export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{error?:string}> }) { const p=await searchParams; return <><PageHeader title="Add project" description="Create a shared project record for your tasks."/><div className="page-content content-narrow"><FormNotice error={p.error}/><ProjectForm/></div></>; }
