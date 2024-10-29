import { SetMetadata } from '@nestjs/common';
import { Role } from '@/contexts/shared/lib/types/roles';

// This decorator is used to mark a method as a route that can only be accessed by users with certain roles

// The key is 'roles' and the value is an array of roles that are allowed to access the route
export const ROLES_KEY = 'roles';

// This function takes an array of roles and returns a decorator that can be applied to a method
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);