import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    return { message: 'Usuário registrado com sucesso' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('status')
  getStatus(@Request() req) {
    return {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      location: this.getCurrentLocation(req),
      status: 'API is running fine',
    };
  }

  private getCurrentLocation(req): string {
    // Simulação de localização. Pode ser substituída por uma função real.
    return 'Latitude: X, Longitude: Y'; 
  }
}
