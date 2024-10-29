import { Workspace } from "@/contexts/domain/models";
import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetAllWorkspacesAsCollaborator {

    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes a userId as a parameter and returns an array of Workspaces where the user provided is a collaborator
    async run(userId: string): Promise<Workspace[]>{

        // Call the repository method to get all workspaces of the user provided where him is a collaborator
        return await this.workspaceRepository.getAllWorkspacesAsCollaboratorOfUserId(userId);
    }
}