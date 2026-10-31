import { Component,inject } from '@angular/core';
import { RouterLink,RouterLinkActive,RouterOutlet } from '@angular/router';
import { CarritoService } from '../services/carrito.service';
import { AuthService } from '../services/auth.service';
import { IconComponent } from '../components/icon/icon.component';
import { iniciales } from '../utils/utils';
// Estructura de las pantallas del cliente: barra superior con carrito y cuenta
@Component({selector:'app-cliente-layout',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,IconComponent],
 templateUrl:'./cliente-layout.component.html',styleUrl:'./cliente-layout.component.css'})
export class ClienteLayoutComponent {
 carrito=inject(CarritoService); auth=inject(AuthService);
 menuAbierto=false; cuentaAbierta=false; iniciales=iniciales;
 salir(){this.carrito.vaciar();this.auth.logout();}
}
