import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UsePipes, ValidationPipe, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from '../contexts_OLD/shared/guards/jwt-auth.guard';
import { UUID } from 'crypto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: UUID, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return this.userService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: UUID) {
    return this.userService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}