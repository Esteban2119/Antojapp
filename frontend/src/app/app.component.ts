import { Component,inject } from '@angular/core';
import { RouterLink,RouterLinkActive,RouterOutlet } from '@angular/router';
import { CarritoService } from './services/carrito.service';
import { NotificacionService } from './services/notificacion.service';
import { IconComponent } from './components/icon/icon.component';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,IconComponent],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent {
 carrito=inject(CarritoService); notificacion=inject(NotificacionService);
 menuAbierto=false;
}
