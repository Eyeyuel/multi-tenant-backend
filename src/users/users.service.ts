import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.Dto';
import { Profile } from 'src/profile/profile.entity';
import { UserAlreadyExistsExseption } from 'src/customExceptions/user-already-exists.exception';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { BcryptProvider } from 'src/auth/provider/bcrypt.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(user)
    private userRepository: Repository<user>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly paginationProvider: PaginationProvider,

    @Inject(forwardRef(() => BcryptProvider))
    private bcryptProvider: BcryptProvider,
  ) {}

  async getAllUsers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<user>> {
    try {
      return await this.paginationProvider.paginationQuery(
        paginationQueryDto,
        this.userRepository,
        undefined,
        ['profile'],
      );
    } catch (error) {
      if (error?.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException(
          'An error has occured. Please try again.',
          { description: 'Could not connect to DB' },
        );
      }
      console.log(error);
      throw error;
    }
  }

  public async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `The user with id ${id} was not found.`,
          table: 'user',
        },
        HttpStatus.NOT_FOUND,
        {
          description: `This exception occured because a user with id:${id} was not found in the user table.`,
        },
      );
    }

    return user;
  }

  public async createUser(userDto: CreateUserDto) {
    try {
      userDto.profile = userDto.profile ?? {};

      // check if the user existes using username and then throw the custom exception
      const existingUserWithUsername = await this.userRepository.findOne({
        where: { username: userDto.username },
      });
      if (existingUserWithUsername) {
        throw new UserAlreadyExistsExseption('username', userDto.username);
      }

      // check if the user existes using email and then throw the custom exception
      const existingUserWithEmail = await this.userRepository.findOne({
        where: { email: userDto.email },
      });
      if (existingUserWithEmail) {
        throw new UserAlreadyExistsExseption('email', userDto.email);
      }
      const newUser = this.userRepository.create({
        ...userDto,
        password: await this.bcryptProvider.hashPassword(userDto.password),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error?.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException(
          'An error has occured. Please try again.',
          { description: 'Could not connect to DB' },
        );
      }
      throw error;

      // if (error.code === '23505') {
      //   throw new BadRequestException('There is some duplicate value.');
      // }
    }
  }

  public async deleteUser(id: number) {
    await this.userRepository.delete(id);
    return `user and realted profile deleted.`;
    // const user = await this.userRepository.findOneBy({ id });
    // if (!user) {
    //   return `no user found with that id`;
    // }
    // await this.userRepository.delete(id);
    // if (user.profile) {
    //   await this.profileRepository.delete(user.profile.id);
    // }
  }

  async getUserByUsername(username: string) {
    let user: user | null = null;
    try {
      user = await this.userRepository.findOneBy({ username });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Some error occured while fetdhing user.',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist.');
    }

    return user;
  }
}
