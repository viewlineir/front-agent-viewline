import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from './core/config';
import { AuthGuard } from './core/auth/services';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HttpInterceptorServise } from './core/interceptors/httpinterceptor.service';
import { createDateProvider, getDateFormat } from './shared/adapter/date-adapte-creator';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    {
      provide: APP_CONFIG,
      useValue: AppConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorServise,
      multi: true
    },
    AuthGuard,
    { provide: DateAdapter, useFactory: createDateProvider, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useFactory: getDateFormat },
  ]
};

