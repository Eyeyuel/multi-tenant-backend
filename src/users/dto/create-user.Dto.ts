import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateProfileDto } from 'src/profile/dto/create.profile.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email!: string;

  @IsNotEmpty()
  @MaxLength(24)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password should be more than 6 characters.' })
  @MaxLength(100)
  password!: string;

  @IsOptional()
  profile?: CreateProfileDto;
}
