import { Component,OnInit,inject } from '@angular/core';
import { RouterLink,RouterLinkActive,RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LocalService } from '../services/local.service';
import { IconComponent } from '../components/icon/icon.component';
import { MediaComponent } from '../components/media/media.component';
import { fondo,iniciales } from '../utils/utils';
// Estructura del panel del restaurante: menu lateral con sus secciones
@Component({selector:'app-local-layout',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,IconComponent,MediaComponent],
 templateUrl:'./local-layout.component.html',styleUrl:'./local-layout.component.css'})
export class LocalLayoutComponent implements OnInit {
 auth=inject(AuthService); local=inject(LocalService);
 menuAbierto=false; fondo=fondo; iniciales=iniciales;
 ngOnInit(){this.local.cargar();}
}
