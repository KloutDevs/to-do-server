import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// This decorator is used to get the user from the request context
export const User = createParamDecorator(

  // This function takes the data and the context and returns the user from the request context
  (data: unknown, ctx: ExecutionContext) => {
    
    // Get the request from the context
    const request = ctx.switchToHttp().getRequest();

    // Return the user from the request
    return request.user;

  },
);