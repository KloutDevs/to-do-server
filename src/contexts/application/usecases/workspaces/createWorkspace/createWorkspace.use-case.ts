import { Workspace } from "@/contexts/domain/models";
import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { Inject,Injectable } from "@nestjs/common";

@Injectable()
export class CreateWorkspaceUseCase {

    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes a userId, name and description as a parameter and returns an array of Workspaces CREATED by the user provided
    async run(userId: string, name: string, description: string): Promise<Workspace>{

        // Call the repository method to create a new workspace
        return await this.workspaceRepository.createWorkspace(userId, name, description);

    }
}