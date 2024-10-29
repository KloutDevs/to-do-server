import { HttpException, HttpStatus } from '@nestjs/common';

// This class is used to throw an exception when a resource already exists
export class AlreadyExistsException extends HttpException {

  // This constructor takes an optional message and sets the status code to 400
  constructor(message?: string) {

    // If no message is provided, set the default message
    if(!message) message = 'Already exists';

    // Call the parent constructor with the message and status code
    super(message, HttpStatus.BAD_REQUEST);

  }
}