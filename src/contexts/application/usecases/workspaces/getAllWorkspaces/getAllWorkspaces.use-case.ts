import { WorkspaceRepository } from "@/contexts/domain/repositories";
import { Workspace } from "@/contexts/domain/models";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetAllWorkspacesUseCase {
    
    // This constructor takes a workspaceRepository as a dependency
    constructor(@Inject('workspaceRepository') private workspaceRepository: WorkspaceRepository){}

    // This function takes an optional limit and orderBy parameters for getting workspaces
    async run(limit?: number, orderBy?: 'desc' | 'asc'): Promise<Workspace[]> {

        // Call the repository method to get all workspaces
        return await this.workspaceRepository.getAllWorkspaces(
            limit,
            orderBy
        );

    }
}