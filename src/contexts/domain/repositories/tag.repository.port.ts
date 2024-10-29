import { Tag } from "@/contexts/domain/models";

export abstract class TagRepository {

    /**
     * Method to get all tags in the app
     * 
     * @param limit - The number of tags to return. This is optional and defaults return all tags.
     * 
     * @param orderBy - The order to return the tags in. You can specify 'desc' for descending order or 'asc' for ascending order.  Default is 'desc'.
     * 
     * @returns {Promise<Tag[]>} An array of all tags in the app
     * 
     * @throws ForbiddenException If the user is not authorized to access to all tags in the app.
     */
    abstract getAllTags(limit?: number, orderBy?: 'desc' | 'asc'): Promise<Tag[]>;

    /**
     * Method to get all tags by workspace id
     * 
     * @param workspaceId - The ID of the workspace where we want to get tags for.
     * 
     * @returns {Promise<Tag[]>} An array of tags in the specified workspace.
     * 
     * @throws BadRequestException If the workspaceId is not provided.
     * 
     * @throws NotFoundException If the workspace with the provided workspaceId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the specified workspace or hasn't admin role.
     */
    abstract getTagsByWorkspaceId(workspaceId: string): Promise<Tag[]>;

    /**
     * Method to get all tags created by a user in all workspaces where he stays.
     * 
     * @param userId - The ID of the user who's tags we want to get.
     *  
     * @returns {Promise<Tag[]>} An array of tags created by the user in all workspaces.
     * 
     * @note This method will return tags that are CREATED by the user provided.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws NotFoundException If the workspace provided don't have any tag
     * 
     * @throws ForbiddenException If the user is not authorized to access to the tags created by the user or hasn't admin role.
     */
    abstract getTagsCreatedByUser(userId: string): Promise<Tag[]>;

    /**
     * Method to get all tags in the account of a user.
     * This method in theory works as a template because all tags in the account of the user
     * can be added to the workspaces of the user.
     * 
     * @param userId - The ID of the user who's tags we want to get.
     * 
     * @returns {Promise<Tag[]>} An array of tags in the account of the user.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the tags in the account of the user or hasn't admin role.
     */
    abstract getTagsOfUser(userId: string): Promise<Tag[]>;

    /**
     * Method to get a specified tag by ID
     * 
     * @param tagId - The ID of the tag we want to get.
     * 
     * @returns {Promise<Tag>} The tag with the ID provided.
     * 
     * @throws BadRequestException If the tagId is not provided.
     * 
     * @throws NotFoundException If the tag with the provided tagId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the specified tag or hasn't admin role.
     */
    abstract getTagById(tagId: string): Promise<Tag>;

    /**
     * Method for getting a tag by name and user id
     * 
     * @param name - The name of the tag we want to get.
     * 
     * @param userId - The ID of the user who's tags we want to get.
     * 
     * @returns {Promise<Tag>} The tag with the name provided.
     * 
     * @throws BadRequestException If the name is not provided.
     * 
     * @throws NotFoundException If the tag with the provided name is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the specified tag or hasn't admin role.
     */
    abstract getTagByNameAndUserId(name: string, userId: string): Promise<Tag>;

    /**
     * Method for creating a new Tag in the app
     * 
     * @param workspaceId - The ID of the workspace where we want to create the tag.
     * 
     * @param userId - The ID of the user who's tag we want to create.
     * 
     * @param name - The name of the tag we want to create.
     * 
     * @param color - The color of the tag we want to create.
     * 
     * @returns {Promise<Tag>} The tag that was created.
     * 
     * @throws BadRequestException If the workspaceId is not provided.
     * 
     * @throws NotFoundException If the workspace with the provided workspaceId is not found.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws BadRequestException If the name is not provided.
     * 
     * @throws BadRequestException If the color is not provided.
     * 
     * @throws AlreadyExistsException If the tag with the provided name already exists.
     * 
     * @throws ForbiddenException If the user is not authorized to create a tag or hasn't admin role in the workspace.
     */
    abstract createNewTag(workspaceId: string, userId: string, name: string, color: string): Promise<Tag>;

    /**
     * Method for updating a tag by ID
     * 
     * @param tagId - The ID of the tag we want to update.
     * 
     * @param tag - The tag we want to update as partial object.
     * 
     * @returns {Promise<Tag>} The tag that was updated.
     * 
     * @throws BadRequestException If the tagId is not provided.
     * 
     * @throws BadRequestException If the tag object is not provided.
     * 
     * @throws NotFoundException If the tag with the provided tagId is not found.
     * 
     * @throws AlreadyExistsException If the tag with the provided name already exists.
     * 
     * @throws ForbiddenException If the user is not authorized to update the tag or hasn't admin role in the workspace.
     */
    abstract updateTag(tagId: string, tag: Partial<Tag>): Promise<Tag>;

    /**
     * Method for deleting a tag by ID
     * 
     * @param tagId - The ID of the tag we want to delete.
     * 
     * @throws BadRequestException If the tagId is not provided.
     * 
     * @throws NotFoundException If the tag with the provided tagId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to delete the tag or hasn't admin role in the workspace.
     */
    abstract deleteTag(tagId: string): Promise<void>;

}