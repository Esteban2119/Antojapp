import { Injectable,inject,signal } from '@angular/core';
import { CatalogoService } from './catalogo.service';
import { AuthService } from './auth.service';
import { Restaurante } from '../models/models';
// Restaurante del usuario LOCAL en sesion, compartido por todas las pantallas del panel
@Injectable({providedIn:'root'}) export class LocalService {
 private catalogo=inject(CatalogoService); private auth=inject(AuthService);
 readonly restaurante=signal<Restaurante|null>(null);
 get id(){return this.auth.sesion()?.restauranteId??0;}
 cargar(){if(this.id)this.catalogo.restaurante(this.id).subscribe(r=>this.restaurante.set(r));}
 actualizar(r:Restaurante){this.restaurante.set(r);}
}
