import { TaskStatus } from "@/contexts/shared/lib/types"

export interface Task {
    task_id: string,
    createdBy: string,
    workspace_id: string,
    title: string,
    description: string
    status: TaskStatus,
    priority: number,
    created_at: Date,
    updated_at: Date,
    due_date: Date,
    completed_at: Date,
    assignedTo: string
}

export type CreateTaskBody = Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'assignedTo' | 'createdBy' | 'workspace_id' | 'due_date'>;