import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('v1/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
