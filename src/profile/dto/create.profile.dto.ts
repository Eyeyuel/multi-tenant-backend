import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString({ message: 'first name should be a string value.' })
  @IsOptional()
  @MinLength(3, { message: 'minimum length should be 3 characters.' })
  @MaxLength(100)
  firstName?: string;

  @IsString({ message: 'last name should be a string value.' })
  @IsOptional()
  @MinLength(3, { message: 'minimum length should be 3 characters.' })
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  gender?: string;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;
}
