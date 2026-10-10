import { format, isBefore, parseISO, startOfWeek, endOfWeek, subDays } from "date-fns";
import type { Task, TaskStatus } from "@/lib/types";
export function todayISO() { return format(new Date(), "yyyy-MM-dd"); }
export function formatDate(value: string | null | undefined, pattern = "d MMM yyyy") { if (!value) return "—"; const date = parseISO(value); return Number.isNaN(date.getTime()) ? value : format(date, pattern); }
export function isOverdue(task: Pick<Task, "deadline" | "status">, today = todayISO()) { return task.status !== "Completed" && Boolean(task.deadline && isBefore(parseISO(task.deadline), parseISO(today))); }
export function statusTone(status: TaskStatus) { return status === "Completed" ? "success" : status === "Waiting" ? "warning" : status === "In Progress" ? "info" : "neutral"; }
export function priorityTone(priority: string) { return priority === "High" ? "danger" : priority === "Medium" ? "warning" : "neutral"; }
export function sortUrgency(tasks: Task[], today = todayISO()) { const rank = { High: 0, Medium: 1, Low: 2 }; return [...tasks].sort((a, b) => Number(isOverdue(b, today)) - Number(isOverdue(a, today)) || rank[a.priority] - rank[b.priority] || (a.deadline || "9999").localeCompare(b.deadline || "9999") || a.planned_date.localeCompare(b.planned_date)); }
export function currentWeekRange() { const now = new Date(); return { from: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"), to: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd") }; }
export function lastSevenDays() { return format(subDays(new Date(), 7), "yyyy-MM-dd"); }
export function safeErrorMessage() { return "We couldn’t save that change. Please check the fields and try again."; }
