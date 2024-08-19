// users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  firstName: string;

  @IsString({ message: 'O sobrenome deve ser uma string' })
  @IsNotEmpty({ message: 'O sobrenome é obrigatório' })
  lastName: string;

  @IsEmail({}, { message: 'O email deve ser um endereço de email válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}
