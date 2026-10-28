import { Component,OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from './services/catalogo.service';
import { PedidosService } from './services/pedidos.service';
import { ItemCarrito,Pedido,Producto,Restaurante } from './models/models';
@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent implements OnInit {
 private catalogo=inject(CatalogoService); private pedidosApi=inject(PedidosService);
 restaurantes:Restaurante[]=[]; productos:Producto[]=[]; carrito:ItemCarrito[]=[]; pedidos:Pedido[]=[];
 categoria='Todos'; busqueda=''; vista:'inicio'|'carrito'|'pedidos'='inicio'; cliente=''; direccion=''; aviso=''; error=''; cargando=true;
 categorias=['Todos','Ecuatoriana','Rápida','Mariscos'];
 ngOnInit(){this.catalogo.restaurantes().subscribe({next:r=>this.restaurantes=r,error:()=>this.error='No se pudo conectar con el servicio de restaurantes (8081).'});this.catalogo.productos().subscribe({next:p=>{this.productos=p;this.cargando=false;},error:()=>{this.error='No se pudo cargar el catálogo. Revisa Spring Boot en el puerto 8081.';this.cargando=false;}});}
 // Filtra el catalogo sin alterar la lista original
 get filtrados(){return this.productos.filter(p=>(this.categoria==='Todos'||p.restaurante.categoria===this.categoria)&&(`${p.nombre} ${p.descripcion}`.toLowerCase().includes(this.busqueda.toLowerCase())));}
 get cantidad(){return this.carrito.reduce((s,i)=>s+i.cantidad,0);}
 get total(){return this.carrito.reduce((s,i)=>s+i.cantidad*i.producto.precio,0);}
 agregar(p:Producto){const item=this.carrito.find(i=>i.producto.id===p.id);if(item)item.cantidad++;else this.carrito.push({producto:p,cantidad:1});this.aviso=`${p.nombre} agregado al carrito`;} 
 quitar(p:Producto){const item=this.carrito.find(i=>i.producto.id===p.id);if(!item)return;item.cantidad--;if(item.cantidad===0)this.carrito=this.carrito.filter(i=>i!==item);}
 ir(v:'inicio'|'carrito'|'pedidos'){this.vista=v;this.error='';this.aviso='';if(v==='pedidos')this.cargarPedidos();window.scrollTo(0,0);}
 cargarPedidos(){this.pedidosApi.listar().subscribe({next:r=>this.pedidos=r,error:()=>this.error='No se pudo conectar con pedidos (8082).'});}
 // Envia un pedido real a la API de Spring Boot y limpia el carrito solo si se guardo
 confirmar(){this.error='';if(!this.cliente.trim()||!this.direccion.trim()){this.error='Escribe tu nombre y dirección.';return;}if(!this.carrito.length)return;
 const detalle=JSON.stringify(this.carrito.map(i=>({productoId:i.producto.id,nombre:i.producto.nombre,cantidad:i.cantidad,precio:i.producto.precio})));
 this.pedidosApi.crear({cliente:this.cliente,direccion:this.direccion,total:this.total,detalle}).subscribe({next:p=>{this.carrito=[];this.aviso=`¡Pedido #${p.id} registrado correctamente!`;this.ir('pedidos');this.aviso=`¡Pedido #${p.id} registrado correctamente!`;},error:()=>this.error='No se pudo registrar el pedido. Revisa el microservicio 8082.'});}
 emoji(p:Producto){const n=p.nombre.toLowerCase();return n.includes('ceviche')?'🍤':n.includes('hamburguesa')?'🍔':n.includes('papas')?'🍟':n.includes('encocado')?'🍛':n.includes('llapingachos')?'🥔':'🍖';}
}
