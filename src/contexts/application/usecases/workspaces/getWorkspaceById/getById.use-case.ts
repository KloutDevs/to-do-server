import { Workspace } from "@/contexts/domain/models";
import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetWorkspaceByIdUseCase {

    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes a workspaceId as a parameter and returns an workspace object
    async run(workspaceId: string): Promise<Workspace>{

        // Call the repository method to get an unique workspace by Id
        return await this.workspaceRepository.getWorkspaceById(workspaceId);
    }
}