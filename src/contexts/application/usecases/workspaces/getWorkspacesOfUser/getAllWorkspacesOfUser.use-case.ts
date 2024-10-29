import { Workspace } from "@/contexts/domain/models";
import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetAllWorkspacesOfUserUseCase {

    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes a userId as a parameter and returns an array of all workspaces of the user provided
    async run(userId: string): Promise<Workspace[]>{

        // Call the repository method to get all workspaces of the user
        return await this.workspaceRepository.getAllWorkspacesOfUserId(userId);
    }
}