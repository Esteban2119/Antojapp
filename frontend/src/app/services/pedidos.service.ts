import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pedido } from '../models/models';
@Injectable({providedIn:'root'}) export class PedidosService {
 private http=inject(HttpClient);
 private api='http://localhost:8082/api/pedidos';
 listar(){return this.http.get<Pedido[]>(this.api);}
 crear(datos:{cliente:string;direccion:string;total:number;detalle:string}){return this.http.post<Pedido>(this.api,datos);}
}
