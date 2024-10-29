import { TaskStatus } from "@/contexts/shared/lib/types";

export interface SubTask {
    subtask_id: string,
    task_id: string,
    createdBy: string,
    title: string,
    description: string,
    status: TaskStatus,
    priority: number,
    created_at: Date,
    updated_at: Date,
    due_at: Date,
    completed_at: Date,
    assignedTo: string
}