import { HttpException, HttpStatus } from '@nestjs/common';
export class ExistsException extends HttpException {
  constructor(target: string) {
    super(`${target}_is_exists`, HttpStatus.BAD_REQUEST);
  }
}
