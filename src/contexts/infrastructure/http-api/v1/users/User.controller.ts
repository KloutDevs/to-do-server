import { Controller, Get, Post, HttpStatus, Body, Param, NotFoundException, HttpCode, BadRequestException, UseGuards } from "@nestjs/common";
import { API_VERSION } from "@/contexts/infrastructure/http-api/v1/route.constants";
import { User, UserProfile, UserProfileWithoutCreatedAt, UserSettings } from "@/contexts/domain/models/";
import { Roles, User as UserDecorator } from "@/contexts/shared/lib/decorators";
import { JwtAuthGuard } from '@/contexts/shared/lib/guards';
import * as UserUseCases from "@/contexts/application/usecases/users";

@UseGuards(JwtAuthGuard)
@Controller(`${API_VERSION}/users`)
export class UserController {

    constructor(
        private readonly getAllUsersUseCase: UserUseCases.getAllUsersUseCase,
        private readonly getUserByIdUseCase: UserUseCases.getUserByIdUseCase,
        private readonly getUserByEmailUseCase: UserUseCases.getUserByEmailUseCase,
        private readonly getUserByUsernameUseCase: UserUseCases.getUserByUsernameUseCase,
        private readonly getSettingsUseCase: UserUseCases.GetSettingsUseCase,
        private readonly updateSettingsUseCase: UserUseCases.UpdateSettingsUseCase,
        private readonly getProfileUseCase: UserUseCases.GetProfileUseCase,
        private readonly updateProfileUseCase: UserUseCases.UpdateProfileUseCase,
        private readonly deleteUserUseCase: UserUseCases.deleteUserUseCase,
    ) {}

    @Get()
    @Roles('ADMIN')
    @HttpCode(HttpStatus.OK)
    async getAllUsers(): Promise<User[]> {
        return this.getAllUsersUseCase.run();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param('id') userId: string): Promise<User> {
        if(!userId) throw new BadRequestException('Se requiere el ID del usuario');
        const user = await this.getUserByIdUseCase.run(userId);
        return user;
    }

    @Get('email/:email')
    @HttpCode(HttpStatus.OK)
    async getUserByEmail(@Param('email') email: string): Promise<User> {
        if(!email) throw new BadRequestException('Se requiere el correo electrónico');
        const user = await this.getUserByEmailUseCase.run(email);
        if (!user) throw new NotFoundException(`Usuario con correo ${email} no encontrado`);
        return user;
    }

    @Get('username/:username')
    @HttpCode(HttpStatus.OK)
    async getUserByUsername(@Param('username') username: string): Promise<User> {
        if(!username) throw new BadRequestException('Se requiere el nombre de usuario');
        const user = await this.getUserByUsernameUseCase.run(username);
        if (!user) throw new NotFoundException(`Usuario con nombre de usuario ${username} no encontrado`);
        return user;
    }

    @Post('delete/:id')
    @Roles('ADMIN')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') userId: string): Promise<{ message: string }> {
        if(!userId) throw new BadRequestException('Se requiere el ID del usuario');
        return this.deleteUserUseCase.run(userId);
    }

    @Get('profile/me')
    @HttpCode(HttpStatus.OK)
    async getUserProfile(@UserDecorator() user): Promise<UserProfile> {
        const userId = user.id;
        if(!userId) throw new BadRequestException('Se requiere el ID del usuario');
        return this.getProfileUseCase.run(userId);
    }

    @Post('profile/update')
    @HttpCode(HttpStatus.OK)
    async updateUserProfile(@UserDecorator() user, @Body() profileDto: UserProfileWithoutCreatedAt): Promise<{message: string, profile: UserProfile}> {
        const userId = user.id;
        if(!userId) throw new BadRequestException('Se requiere el ID del usuario');
        const updatedProfile = await this.updateProfileUseCase.run(userId, profileDto);
        return {
            message: 'Perfil actualizado exitosamente',
            profile: updatedProfile,
        };
    }

    @Get('settings/me')
    @HttpCode(HttpStatus.OK)
    async getUserSettings(@UserDecorator() user): Promise<UserSettings> {
        const userEmail = user.email;
        if(!userEmail) throw new BadRequestException('Se requiere el correo electrónico del usuario');
        return this.getSettingsUseCase.run(userEmail);
    }

    @Post('settings/update')
    @HttpCode(HttpStatus.OK)
    async updateUserSettings(@UserDecorator() user, @Body() settingsDto: UserSettings): Promise<{message: string, settings: UserSettings}> {
        const userId = user.id;
        if(!userId) throw new BadRequestException('Se requiere el ID del usuario');
        const updatedSettings = await this.updateSettingsUseCase.run(userId, settingsDto);
        return {
            message: 'Settings successfully updated.',
            settings: updatedSettings,
        };
    }
}