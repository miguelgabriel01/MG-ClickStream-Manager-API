// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log(`Validando usuário: ${email}`);
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.log('Usuário não encontrado');
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      console.log('Senha validada com sucesso');
      console.log(user.password)
      return { id: user.id, email: user.email };
    } else {
      console.log('Falha na validação da senha');
      throw new UnauthorizedException('Email ou senha invalidos');
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
