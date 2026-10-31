import { Injectable, computed, effect, signal } from '@angular/core';
import { ItemCarrito, Producto, Restaurante } from '../models/models';
import { precioFinal } from '../utils/utils';
export interface GrupoCarrito { restaurante:Restaurante; items:ItemCarrito[]; total:number; }
// Estado del carrito compartido entre pantallas y guardado en el navegador
@Injectable({providedIn:'root'}) export class CarritoService {
 private clave='antojapp_carrito';
 readonly items=signal<ItemCarrito[]>(this.leer());
 readonly cantidad=computed(()=>this.items().reduce((s,i)=>s+i.cantidad,0));
 readonly subtotal=computed(()=>this.items().reduce((s,i)=>s+i.cantidad*i.producto.precio,0));
 readonly total=computed(()=>this.items().reduce((s,i)=>s+i.cantidad*precioFinal(i.producto),0));
 readonly ahorro=computed(()=>this.subtotal()-this.total());
 // Un pedido por restaurante: cada local recibe solo lo suyo
 readonly porRestaurante=computed(()=>{
  const grupos=new Map<number,GrupoCarrito>();
  for(const i of this.items()){const r=i.producto.restaurante;const g=grupos.get(r.id)??{restaurante:r,items:[],total:0};g.items.push(i);g.total+=i.cantidad*precioFinal(i.producto);grupos.set(r.id,g);}
  return [...grupos.values()];
 });
 constructor(){effect(()=>localStorage.setItem(this.clave,JSON.stringify(this.items())));}
 cantidadDe(id:number){return this.items().find(i=>i.producto.id===id)?.cantidad??0;}
 agregar(p:Producto){this.items.update(l=>l.some(i=>i.producto.id===p.id)?l.map(i=>i.producto.id===p.id?{...i,cantidad:i.cantidad+1}:i):[...l,{producto:p,cantidad:1}]);}
 quitar(p:Producto){this.items.update(l=>l.map(i=>i.producto.id===p.id?{...i,cantidad:i.cantidad-1}:i).filter(i=>i.cantidad>0));}
 eliminar(id:number){this.items.update(l=>l.filter(i=>i.producto.id!==id));}
 vaciar(){this.items.set([]);}
 // Actualiza precios/descuentos guardados y quita productos que ya no estan disponibles
 sincronizar(productos:Producto[]){const m=new Map(productos.map(p=>[p.id,p]));this.items.update(l=>l.filter(i=>m.get(i.producto.id)?.disponible).map(i=>({...i,producto:m.get(i.producto.id)!})));}
 private leer():ItemCarrito[]{try{return JSON.parse(localStorage.getItem(this.clave)||'[]');}catch{return [];}}
}
