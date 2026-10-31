import { Component,inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacionService } from './services/notificacion.service';
import { IconComponent } from './components/icon/icon.component';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,IconComponent],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent { notificacion=inject(NotificacionService); }
