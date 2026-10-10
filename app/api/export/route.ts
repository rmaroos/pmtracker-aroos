import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/lib/types";
function csvCell(value: unknown) { const text = value == null ? "" : String(value); return '"' + text.replaceAll('"','""') + '"'; }
export async function GET(request: Request) {
 const url = new URL(request.url); const from = url.searchParams.get("from"); const to = url.searchParams.get("to"); const history = url.searchParams.get("scope") === "history"; const supabase = await createClient();
 let query = supabase.from("tasks").select("*, projects(name,client_name)").is("deleted_at",null).eq("status","Completed").order("completed_at",{ascending:false});
 if (from) query = query.gte("completed_at",from+"T00:00:00"); if (to) query = query.lte("completed_at",to+"T23:59:59");
 const {data,error}=await query; if(error) return NextResponse.json({error:"Export could not be created."},{status:500}); const tasks=(data||[]) as unknown as Task[];
 const rows=[["Completed Date","Client","Project","Task / Activity","Category","Priority","Planned Date","Deadline","Notes"],...tasks.map(t=>[t.completed_at||"",t.projects?.client_name||"",t.projects?.name||"",t.title,t.category,t.priority,t.planned_date,t.deadline||"",t.notes||""])];
 const csv=rows.map(row=>row.map(csvCell).join(",")).join("\r\n"); const fileName=history?"pm-completed-history.csv":"pm-completed-work-"+(from||"filtered")+".csv";
 return new NextResponse(csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":"attachment; filename=\"" + fileName + "\"","Cache-Control":"private, no-store"}});
}
