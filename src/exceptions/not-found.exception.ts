import { HttpException, HttpStatus } from '@nestjs/common';
export class NotFoundException extends HttpException {
  constructor(target: string) {
    super(`${target}_not_found`, HttpStatus.BAD_REQUEST);
  }
}
