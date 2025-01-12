import { CreateRequestDto } from './create-request.dto';

export class CreateChannelRequestDto extends CreateRequestDto {
  /**
   * The I.D of the device to add the channel too.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  deviceId!: string;
}
