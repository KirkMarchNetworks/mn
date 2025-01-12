import { applyDecorators } from "@nestjs/common";
import { ApiCreatedResponse } from "@nestjs/swagger";
import { AuthResponseDto } from "../dtos/auth-response.dto";

export function ApiAuthCreatedResponse() {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'The user entity and the bearer token.',
      type: AuthResponseDto
    })
  );
}


