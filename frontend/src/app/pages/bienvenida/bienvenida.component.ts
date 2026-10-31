import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
// Punto de entrada: el usuario elige si es cliente o restaurante
@Component({selector:'app-bienvenida',standalone:true,imports:[RouterLink,IconComponent],templateUrl:'./bienvenida.component.html',styleUrl:'./bienvenida.component.css'})
export class BienvenidaComponent {
 platos=['/img/productos/llapingachos.png','/img/productos/hamburguesa-clasica.png','/img/productos/hornado.png','/img/productos/ceviche-camaron.png','/img/productos/encocado.png','/img/productos/papas-especiales.png'];
}
