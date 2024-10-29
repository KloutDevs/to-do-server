import { Workspace } from "@/contexts/domain/models";
import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteWorkspaceUseCase {

    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes a workspaceId as a parameter and returns a message
    async run(workspaceId: string): Promise<{message: string}>{

        // Call the repository method to delete a workspace
        await this.workspaceRepository.deleteWorkspace(workspaceId);

        // Return a succesfully message when the workspace is deleted.
        return {message: "Successfully deleted."}

    }
}