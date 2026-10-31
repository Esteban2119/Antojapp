import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
registerLocaleData(localeEs);
// Inicia Angular y habilita llamadas HTTP a Spring Boot
bootstrapApplication(AppComponent,{providers:[provideHttpClient(),provideRouter(routes,withInMemoryScrolling({scrollPositionRestoration:'top'})),{provide:LOCALE_ID,useValue:'es'}]}).catch(console.error);
