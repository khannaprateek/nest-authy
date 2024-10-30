import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/user/user.service';
import { CreateUserDto, AuthResponseDto, UserResponseDto } from 'src/dtos';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      console.log('email', email);
      console.log('password', password);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async register(registerDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(registerDto, true);

    return user;
  }

  async login(user: any): Promise<AuthResponseDto> {
    const token = this.createToken(user);
    const userData = await this.usersService.getUserById(user.id);

    return {
      access_token: token,
      user: userData,
    };
  }

  private createToken(user: any): string {
    const log = new Logger(AuthService.name);
    log.debug(process.env.JWT_SECRET);
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
