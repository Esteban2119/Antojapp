import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto, Restaurante } from '../models/models';
@Injectable({providedIn:'root'}) export class CatalogoService {
 private http=inject(HttpClient);
 // El puerto 8081 corresponde al microservicio de restaurantes
 private api='http://localhost:8081/api';
 restaurantes(){return this.http.get<Restaurante[]>(`${this.api}/restaurantes`);}
 productos(){return this.http.get<Producto[]>(`${this.api}/productos`);}
}
