import { WorkspaceCollaborator } from "@/contexts/domain/models";
import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AddCollaboratorUseCase {

    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes a workspaceId as a parameter, a userId and returns the workspaceCollaborator object created
    async run(workspaceId: string, userId: string): Promise<WorkspaceCollaborator>{

        // Call the repository method to add in the workspace provided a new collaborator
        return await this.workspaceRepository.addCollaboratorToWorkspace(workspaceId, userId);
    }
}