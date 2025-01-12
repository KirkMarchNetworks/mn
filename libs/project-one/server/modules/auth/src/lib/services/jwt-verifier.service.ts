import { Injectable } from '@nestjs/common';
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtVerifierService {

  constructor(private jwtService: JwtService) {}

  verify(token: string) {
    return this.jwtService.verify(token);
  }
}
