import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UserResponseDto } from 'src/dtos/user-response.dto';
import { LoginDto } from 'src/dtos';
import { UserRole } from 'src/util/enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto | LoginDto,
    isAdmin: boolean,
  ): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // If not admin, force the role to be USER regardless of what was passed
      const userData = {
        ...createUserDto,
        role:
          isAdmin && 'role' in createUserDto
            ? createUserDto.role
            : UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = this.usersRepository.create(userData);
      const savedUser = await this.usersRepository.save(user);

      return plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new ConflictException('Error creating user');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) =>
      plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }),
    );
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.findById(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    updateUserDto: UserResponseDto,
    isAdmin: boolean,
  ): Promise<UserResponseDto> {
    const user = await this.findById(updateUserDto.id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // If not admin and trying to update role, throw error
    if (!isAdmin && 'role' in updateUserDto && updateUserDto.role) {
      // throw new ForbiddenException('Only admins can update user roles');

      updateUserDto.role = user.role;
    }

    // If not admin, ensure role is not included in the update
    const updateData = isAdmin
      ? updateUserDto
      : Object.fromEntries(
          Object.entries(updateUserDto).filter(([key]) => key !== 'role'),
        );

    Object.assign(user, updateData);
    user.updatedAt = new Date();

    const updatedUser = await this.usersRepository.save(user);

    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
}
