import { Controller, Get, Res, HttpStatus, Body, Param, Post } from "@nestjs/common";
import { API_VERSION } from "@/contexts/infrastructure/http-api/v1/route.constants";
import { getUserByIdUseCase, getUserByEmailUseCase, deleteUserUseCase, updateUserUseCase, getAllUsersUseCase } from "@/contexts/application/usecases/users";
import { User } from "@/contexts/domain/models/user.entity";
@Controller(`${API_VERSION}/users`)
export class UserController{
    constructor(
        private readonly getUserByIdUseCase: getUserByIdUseCase,
        private readonly getUserByEmailUseCase: getUserByEmailUseCase,
        private readonly deleteUserUseCase: deleteUserUseCase,
        private readonly updateUserUseCase: updateUserUseCase,
        private readonly getAllUsersUseCase: getAllUsersUseCase,
    ){}

    @Get(':id')
    async getUserById(@Res() response, @Param('id') userId: string): Promise<User>{
        const user = await this.getUserByIdUseCase.execute(userId)
        return response.status(HttpStatus.FOUND).json(user);
    }

    @Get(':email')
    async getUserByEmail(@Res() response, @Param('email') email: string): Promise<User>{
        const user = await this.getUserByEmailUseCase.execute(email);
        return response.status(HttpStatus.FOUND).json(user);
    }

    @Get('delete/:id')
    async deleteUser(@Res() response, @Param('id') userId: string): Promise<User>{
        const user = await this.deleteUserUseCase.execute(userId);
        return response.status(HttpStatus.OK).json(user);
    }
    
    @Post('update/:id')
    async updateUser(@Res() response, @Body() user: User, @Param('id') userId: string){
        const newUser = await this.updateUserUseCase.execute(userId, user);
        return response.status(HttpStatus.OK).json(newUser);
    }

    @Get('all')
    async getAllUsers(@Res() response):Promise<User[]>{
        const users = await this.getAllUsersUseCase.execute();
        return response.status(HttpStatus.OK).json(users);
    }

}