import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/util/enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
