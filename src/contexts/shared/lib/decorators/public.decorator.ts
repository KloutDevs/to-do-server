import { SetMetadata } from '@nestjs/common';

// This decorator is used to mark a method as public route
export const Public = () => SetMetadata('isPublic', true);