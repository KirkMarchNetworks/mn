import { HttpException } from '@nestjs/common';
import { CreateCustomResponseInterface } from './models/create-custom-response.interface';
import { CustomResponseInterface } from './models/custom-response.interface';

export class BaseExceptionDto extends HttpException {
  private _obj: CreateCustomResponseInterface;

  constructor(
    obj: CreateCustomResponseInterface,
  ) {
    super({
      ...obj,
      timestamp: (new Date).toISOString()
    } as CustomResponseInterface, typeof obj.statusCode === 'string' ? parseInt(obj.statusCode, 10) : obj.statusCode);
    this._obj = obj;
  }

  getClientCode() {
    return this._obj.errorCode;
  }
}
