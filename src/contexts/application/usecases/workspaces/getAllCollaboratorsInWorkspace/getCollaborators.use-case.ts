import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { WorkspaceCollaborator } from "@/contexts/domain/models";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCollaboratorsUseCase {

    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes a workspaceId as a parameter and returns an array of WorkspaceCollaborator object
    async run(workspaceId: string): Promise<WorkspaceCollaborator[]>{

        // Call the repository method to get all collaborators in a specific workspaace
        return await this.workspaceRepository.getAllCollaboratorsInWorkspace(workspaceId);
        
    }
}