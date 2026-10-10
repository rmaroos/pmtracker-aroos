import { AlertCircle, CheckCircle2, Clock3, Plus } from "lucide-react";
import { priorityTone, statusTone, isOverdue, formatDate } from "@/lib/utils";
import type { Task } from "@/lib/types";
export function ButtonLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) { return <a className={secondary ? "button secondary" : "button primary"} href={href}>{children}</a>; }
export function StatusBadge({ status }: { status: string }) { return <span className={"badge " + statusTone(status as Task["status"])}>{status}</span>; }
export function PriorityBadge({ priority }: { priority: string }) { return <span className={"priority " + priorityTone(priority)}><span className="priority-dot"/>{priority}</span>; }
export function AlertMessage({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) { const Icon = kind === "error" ? AlertCircle : CheckCircle2; return <div className={"alert " + kind}><Icon size={16}/>{children}</div>; }
export function EmptyState({ title, detail, href, action }: { title: string; detail: string; href?: string; action?: string }) { return <div className="empty-state"><span className="empty-icon"><Clock3 size={19}/></span><b>{title}</b><p>{detail}</p>{href && action ? <a className="button secondary small" href={href}><Plus size={15}/>{action}</a> : null}</div>; }
export function Deadline({ task }: { task: Task }) { const overdue = isOverdue(task); return <span className={overdue ? "deadline overdue" : "deadline"}>{overdue ? <AlertCircle size={14}/> : null}{formatDate(task.deadline, "d MMM")}{overdue ? <small>Overdue</small> : null}</span>; }
