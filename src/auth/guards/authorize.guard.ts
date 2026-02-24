import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import authConfig from '../config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/constants/constants';

interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
  aud?: string | string[];
  iss?: string;
}

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Read isPublic metadata
    const isPublic: boolean | undefined = this.reflector.getAllAndOverride(
      'isPublic',
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    // extract request obj from execution context
    const req: Request = context.switchToHttp().getRequest();

    // extract token from the request header it is a string with structure like 'Bearer token-is-here'
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        token,
        this.authConfiguration,
      );

      req[REQUEST_USER_KEY] = payload;
      console.log(payload);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    return true;
  }
}
