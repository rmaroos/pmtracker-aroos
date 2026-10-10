import test from "node:test";
import assert from "node:assert/strict";
import { isOverdue, sortUrgency } from "@/lib/utils";
import type { Task } from "@/lib/types";

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    project_id: null,
    title: "Example task",
    category: "Project Planning",
    priority: "Medium",
    status: "Planned",
    planned_date: "2026-10-11",
    deadline: null,
    notes: null,
    completed_at: null,
    created_at: "2026-10-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
    ...overrides,
  };
}

test("overdue is a derived condition and completed tasks are never overdue", () => {
  assert.equal(isOverdue(task({ deadline: "2026-10-10", status: "Waiting" }), "2026-10-11"), true);
  assert.equal(isOverdue(task({ deadline: "2026-10-11" }), "2026-10-11"), false);
  assert.equal(isOverdue(task({ deadline: "2026-10-10", status: "Completed" }), "2026-10-11"), false);
});

test("urgency sort puts overdue work first, then higher priority", () => {
  const sorted = sortUrgency([
    task({ id: "low", priority: "Low", deadline: "2026-10-20" }),
    task({ id: "high", priority: "High", deadline: "2026-10-20" }),
    task({ id: "late", priority: "Low", deadline: "2026-10-10" }),
  ], "2026-10-11");
  assert.deepEqual(sorted.map(item => item.id), ["late", "high", "low"]);
});
