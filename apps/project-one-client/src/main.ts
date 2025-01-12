/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { RootComponent, rootConfig } from '@mn/project-one/client/root';

bootstrapApplication(RootComponent, rootConfig).catch((err) =>
  console.error(err)
);
