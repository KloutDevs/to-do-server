export interface Tag {
    tag_id: string,
    created_by: string,
    workspace_id?: string,
    name: string, 
    color: string
}

export interface TaskTags{
    task_id: string,
    tag_id: string,
}