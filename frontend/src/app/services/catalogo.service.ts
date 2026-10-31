import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto, Restaurante } from '../models/models';
export type ProductoForm=Omit<Producto,'id'|'restaurante'>&{restaurante:{id:number}};
@Injectable({providedIn:'root'}) export class CatalogoService {
 private http=inject(HttpClient);
 // El puerto 8081 corresponde al microservicio de restaurantes
 private api='http://localhost:8081/api';
 restaurantes(){return this.http.get<Restaurante[]>(`${this.api}/restaurantes`);}
 productos(){return this.http.get<Producto[]>(`${this.api}/productos`);}
 productosDe(restauranteId:number){return this.http.get<Producto[]>(`${this.api}/restaurantes/${restauranteId}/productos`);}
 crearProducto(p:ProductoForm){return this.http.post<Producto>(`${this.api}/productos`,p);}
 actualizarProducto(id:number,p:ProductoForm){return this.http.put<Producto>(`${this.api}/productos/${id}`,p);}
 eliminarProducto(id:number){return this.http.delete<void>(`${this.api}/productos/${id}`);}
}
