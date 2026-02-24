import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.Dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private UsersService: UsersService,

    private hasinigProvider: HashingProvider,

    @Inject(authConfig.KEY)
    private readonly authconfigration: ConfigType<typeof authConfig>,

    private jwtService: JwtService,
  ) {}

  async login(logindto: LoginDto) {
    // find the user
    const user = await this.UsersService.getUserByUsername(logindto.username);

    // compare password

    let isEqual: boolean = false;

    isEqual = await this.hasinigProvider.comparePassword(
      logindto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password.');
    }

    // return token if the user exists
    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.authconfigration.secret,
        expiresIn: this.authconfigration.expiresIn,
        audience: this.authconfigration.audience,
        issuer: this.authconfigration.issuer,
      },
    );

    return token;
  }

  async signup(createUserDto: CreateUserDto) {
    return await this.UsersService.createUser(createUserDto);
  }
}
