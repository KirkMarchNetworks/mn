import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable} from '@nestjs/common';
import { JwtParsedTokenInterface } from '@mn/project-one/server/models';
import { secretKey } from '../models/secret-key';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: JwtParsedTokenInterface) {
    return await new Promise<JwtParsedTokenInterface>((resolve) => {
      resolve(payload);
    });
  }
}
