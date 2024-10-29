export interface Workspace{
    id: string;
    name: string;
    description: string;
    created_at: Date;
    isArchived: boolean;
    archived_date: Date;
    user_id: string;
}

export interface WorkspaceCollaborator{
    workspace_id: string;
    collaborator_id: string;
    role?: string;
    added_at: Date;
}