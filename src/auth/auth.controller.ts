import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.Dto';
import { LoginDto } from './dto/login.dto';
import { AllowAnonymous } from './docorators/allow-anonymous.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AllowAnonymous()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() logindto: LoginDto) {
    return this.authService.login(logindto);
  }

  @AllowAnonymous()
  @Post('signup')
  async signup(@Body() CreateUserDto: CreateUserDto) {
    return await this.authService.signup(CreateUserDto);
  }
}
