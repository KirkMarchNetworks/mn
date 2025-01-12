import { registerAs } from "@nestjs/config";

export const bullBoardConfig = registerAs('bullBoard', () => ({
  username: process.env['BULL_BOARD_USERNAME'],
  password: process.env['BULL_BOARD_PASSWORD'],
}));
