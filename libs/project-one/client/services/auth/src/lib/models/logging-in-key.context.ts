import { HttpContextToken } from "@angular/common/http";

export const LoggingInKeyContext = new HttpContextToken<boolean>(() => false);
