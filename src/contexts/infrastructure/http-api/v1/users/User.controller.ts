import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { CreateUserUseCase } from "@/contexts/application/usecases/users/create-user-user-case/createUser.use-case";
import { API_VERSION } from "../route.constants";
import { CreateUserDto } from "@/contexts/application/usecases/users/create-user-user-case/createUser.dto";
import { User } from "@/contexts/domain/models/user.entity";

@Controller(`${API_VERSION}/users`)
export class UserController{
    constructor(private readonly createUserUseCase: CreateUserUseCase){}

}