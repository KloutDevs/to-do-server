import { Controller, Get, Post, Res, HttpStatus, Body, Param, NotFoundException, HttpCode } from "@nestjs/common";
import { API_VERSION } from "@/contexts/infrastructure/http-api/v1/route.constants";
import { getUserByIdUseCase, getUserByEmailUseCase, getUserByUsernameUseCase, deleteUserUseCase, PartialUpdateUseCase, getAllUsersUseCase } from "@/contexts/application/usecases/users";
import { User } from "@/contexts/domain/models/user.entity";

@Controller(`${API_VERSION}/users`)
export class UserController {
    constructor(
        private readonly getUserByIdUseCase: getUserByIdUseCase,
        private readonly getUserByEmailUseCase: getUserByEmailUseCase,
        private readonly getUserByUsernameUseCase: getUserByUsernameUseCase,
        private readonly deleteUserUseCase: deleteUserUseCase,
        private readonly partialUpdateUseCase: PartialUpdateUseCase,
        private readonly getAllUsersUseCase: getAllUsersUseCase,
    ) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param('id') userId: string): Promise<User> {
        const user = await this.getUserByIdUseCase.execute(userId);
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
        return user;
    }

    @Get('email/:email')
    @HttpCode(HttpStatus.OK)
    async getUserByEmail(@Param('email') email: string): Promise<User> {
        const user = await this.getUserByEmailUseCase.execute(email);
        if (!user) throw new NotFoundException(`User with email ${email} not found`);
        return user;
    }

    @Get('username/:username')
    @HttpCode(HttpStatus.OK)
    async getUserByUsername(@Param('username') username: string): Promise<User> {
        const user = await this.getUserByUsernameUseCase.execute(username);
        if (!user) throw new NotFoundException(`User with username ${username} not found`);
        return user;
    }

    @Post('delete/:id')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') userId: string): Promise<User> {
        return this.deleteUserUseCase.execute(userId);
    }
    
    @Post('update/:id')
    @HttpCode(HttpStatus.OK)
    async updateUser(@Body() user: Partial<User>, @Param('id') userId: string): Promise<User> {
        return this.partialUpdateUseCase.execute(userId, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllUsers(): Promise<User[]> {
        return this.getAllUsersUseCase.execute();
    }
}