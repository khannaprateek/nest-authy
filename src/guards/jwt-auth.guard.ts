import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Log authentication attempt
    const request = context.switchToHttp().getRequest();
    this.logger.debug(
      `Auth attempt - Path: ${request.path}, Token present: ${!!request.headers.authorization}`,
    );

    // Handle specific JWT errors
    if (info instanceof TokenExpiredError) {
      this.logger.warn('Token expired');
      throw new UnauthorizedException('Token has expired');
    }

    if (info instanceof JsonWebTokenError) {
      this.logger.warn('Invalid token', info, request.headers.authorization);
      this.logger.debug('secret', process.env.JWT_SECRET);
      throw new UnauthorizedException('Invalid token');
    }

    if (err || !user) {
      this.logger.warn('Authentication failed', { err, user });
      throw new UnauthorizedException('Authentication failed');
    }

    // Log successful authentication
    this.logger.debug(`User authenticated: ${user.email}`);
    return user;
  }
}
