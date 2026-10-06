import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent} from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// Change to have the ANY in err
bootstrapApplication(AppComponent, appConfig)
  .catch((err: unknown) => console.error(err));
  {
  providers: [provideRouter(routes)]
};

