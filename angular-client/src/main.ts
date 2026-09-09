import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Change to have the ANY in err
bootstrapApplication(App, appConfig)
  .catch((err: unknown) => console.error(err));
