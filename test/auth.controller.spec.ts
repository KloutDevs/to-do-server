import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/contexts/infrastructure/http-api/v1/auth/Auth.controller';
import { LoginUseCase, RegisterUseCase, ValidateUserUseCase } from '@/contexts/application/usecases/auth';
import { LoginRequestDto, RegisterRequestDto } from '@/contexts/infrastructure/http-api/v1/auth/dtos';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let loginUseCase: LoginUseCase;
  let registerUseCase: RegisterUseCase;
  let validateUserUseCase: ValidateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: RegisterUseCase,
          useValue: {
            register: jest.fn(),
          },
        },
        {
          provide: ValidateUserUseCase,
          useValue: {},
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    registerUseCase = module.get<RegisterUseCase>(RegisterUseCase);
  });

  describe('login', () => {
    it('should return an access token when login is successful', async () => {
      const loginDto: LoginRequestDto = { email: 'test@example.com', password: 'password' };
      const result = { access_token: 'dummy_token' };

      jest.spyOn(loginUseCase, 'login').mockImplementation(async () => result);

      expect(await authController.login(loginDto)).toEqual(result);
    });

    it('should throw a BadRequestException when login fails', async () => {
      const loginDto: LoginRequestDto = { email: 'test@example.com', password: 'wrong_password' };

      jest.spyOn(loginUseCase, 'login').mockImplementation(async () => {
        throw new BadRequestException('Invalid credentials');
      });

      await expect(authController.login(loginDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('register', () => {
    it('should return an access token when registration is successful', async () => {
      const registerDto: RegisterRequestDto = { email: 'test@example.com', password: 'password', username: 'testuser' };
      const result = { access_token: 'dummy_token' };

      jest.spyOn(registerUseCase, 'register').mockImplementation(async () => result);

      expect(await authController.register(registerDto)).toEqual(result);
    });

    it('should throw a BadRequestException when registration fails', async () => {
      const registerDto: RegisterRequestDto = { email: 'test@example.com', password: 'password', username: 'testuser' };

      jest.spyOn(registerUseCase, 'register').mockImplementation(async () => {
        throw new BadRequestException('Error occurred');
      });

      await expect(authController.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });
});