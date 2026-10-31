import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstadoPedido, NuevoPedido, Pedido } from '../models/models';
@Injectable({providedIn:'root'}) export class PedidosService {
 private http=inject(HttpClient);
 private api='http://localhost:8082/api/pedidos';
 porEmail(email:string){return this.http.get<Pedido[]>(this.api,{params:{email}});}
 porRestaurante(restauranteId:number){return this.http.get<Pedido[]>(this.api,{params:{restauranteId}});}
 crear(datos:NuevoPedido){return this.http.post<Pedido>(this.api,datos);}
 cambiarEstado(id:number,estado:EstadoPedido,motivo?:string){return this.http.patch<Pedido>(`${this.api}/${id}/estado`,{estado,motivo:motivo??''});}
}
