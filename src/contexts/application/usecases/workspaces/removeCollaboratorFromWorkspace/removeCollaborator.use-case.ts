import { WorkspaceCollaborator } from "@/contexts/domain/models";
import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteCollaboratorUseCase {

    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes a workspaceId and a userId as parameters and returns the workspaceCollaborator object removed
    async run(workspaceId: string, userId: string): Promise<WorkspaceCollaborator>{

        // Call the repository method to remove the collaborator from the workspace
        return await this.workspaceRepository.removeCollaboratorFromWorkspace(workspaceId, userId);
    }
}