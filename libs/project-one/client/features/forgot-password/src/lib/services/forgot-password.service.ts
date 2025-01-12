import { inject, Injectable } from '@angular/core';
import {
  AuthApiService,
  ForgotPasswordRequestDto,
} from '@mn/project-one/shared/api-client';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordServiceDeprecated {

  private service = inject(AuthApiService);

  forgotPassword(dto: ForgotPasswordRequestDto) {
    return this.service.authControllerForgotPassword(dto);
  }
}
