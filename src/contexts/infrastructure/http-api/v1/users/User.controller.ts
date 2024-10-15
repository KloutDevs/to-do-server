import { Controller, Get, Post, HttpStatus, Body, Param, NotFoundException, HttpCode, Query, BadRequestException, Request } from "@nestjs/common";
import { API_VERSION } from "@/contexts/infrastructure/http-api/v1/route.constants";
import { getUserByIdUseCase, getUserByEmailUseCase, getUserByUsernameUseCase, deleteUserUseCase, PartialUpdateUseCase, getAllUsersUseCase } from "@/contexts/application/usecases/users";
import { User } from "@/contexts/domain/models/user.entity";
import { Roles } from "@/contexts/shared/decorators";
import { Role } from "@/contexts/shared/types/roles";
import {validate as uuidValidate} from 'uuid';

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
        if(!userId) throw new BadRequestException('User ID is required');
        if(!uuidValidate(userId)) throw new BadRequestException('Invalid User ID');
        const user = await this.getUserByIdUseCase.execute(userId);
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
        return user;
    }

    @Get('email/:email')
    @Roles(Role.USER)
    @HttpCode(HttpStatus.OK)
    async getUserByEmail(@Request() req, @Param('email') email: string): Promise<User> {
        if(!email) throw new BadRequestException('Email is required');
        const user = await this.getUserByEmailUseCase.execute(email);
        if (!user) throw new NotFoundException(`User with email ${email} not found`);
        return user;
    }

    @Get('username')
    @HttpCode(HttpStatus.OK)
    async getUserByUsername(@Query('username') username: string): Promise<User> {
        if(!username) throw new BadRequestException('Username is required');
        const user = await this.getUserByUsernameUseCase.execute(username);
        if (!user) throw new NotFoundException(`User with username ${username} not found`);
        return user;
    }

    @Post('delete/:id')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') userId: string): Promise<User> {
        if(!userId) throw new BadRequestException('User ID is required');
        return this.deleteUserUseCase.execute(userId);
    }

    @Post('update/:id')
    @HttpCode(HttpStatus.OK)
    async updateUser(@Body() user: Partial<User>, @Param('id') userId: string): Promise<User> {
        if(!userId) throw new BadRequestException('User ID is required');
        if(!user) throw new BadRequestException('User as update body is required');
        return this.partialUpdateUseCase.execute(userId, user);
    }

    @Get()
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    async getAllUsers(): Promise<User[]> {
        return this.getAllUsersUseCase.execute();
    }
}