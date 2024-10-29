import { Workspace } from "@/contexts/domain/models";   
import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateWorkspaceUseCase {

    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes a workspaceId as a parameter, a workspace object and returns the workspace already updated
    async run(workspaceId: string, workspace: Workspace): Promise<Workspace>{

        // Call the repository method to update a specific workspace
        return await this.workspaceRepository.updateWorkspace(workspaceId, workspace);
    }
}