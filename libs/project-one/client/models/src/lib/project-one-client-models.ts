import { HttpContextToken } from "@angular/common/http";

export const DisableLoaderKey = new HttpContextToken<boolean>(() => false);
