import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
// Inicia Angular y habilita llamadas HTTP a Spring Boot
bootstrapApplication(AppComponent,{providers:[provideHttpClient()]}).catch(console.error);
