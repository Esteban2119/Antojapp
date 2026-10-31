import { Component,DestroyRef,OnInit,inject } from '@angular/core';
import { CurrencyPipe,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { CatalogoService } from '../../services/catalogo.service';
import { PedidosService } from '../../services/pedidos.service';
import { NotificacionService } from '../../services/notificacion.service';
import { EstadoPedido,Pedido,Producto,Restaurante } from '../../models/models';
import { ESTADOS,detalle,fondo,imagenProducto,iniciales,mapaUrl,precioFinal } from '../../utils/utils';
import { IconComponent,IconName } from '../../components/icon/icon.component';
import { MediaComponent } from '../../components/media/media.component';
type Filtro='nuevos'|'proceso'|'finalizados';
interface FormProducto { id?:number; nombre:string; descripcion:string; precio:number|null; descuento:number; imagen:string; disponible:boolean; }
const RESTAURANTE_KEY='antojapp_restaurante';
const SIGUIENTE:Partial<Record<EstadoPedido,{estado:EstadoPedido;label:string;icono:IconName}>>={
 CONFIRMADO:{estado:'PREPARANDO',label:'Empezar preparación',icono:'flame'},
 PREPARANDO:{estado:'EN_CAMINO',label:'Enviar pedido',icono:'truck'},
 EN_CAMINO:{estado:'ENTREGADO',label:'Marcar entregado',icono:'checkCircle'}};
@Component({selector:'app-panel-restaurante',standalone:true,imports:[CurrencyPipe,DatePipe,FormsModule,IconComponent,MediaComponent],templateUrl:'./panel-restaurante.component.html',styleUrl:'./panel-restaurante.component.css'})
export class PanelRestauranteComponent implements OnInit {
 private catalogo=inject(CatalogoService); private pedidosApi=inject(PedidosService); private notificacion=inject(NotificacionService); private destroyRef=inject(DestroyRef);
 restaurantes:Restaurante[]=[]; restaurante:Restaurante|null=null; tab:'pedidos'|'productos'='pedidos'; filtro:Filtro='nuevos';
 pedidos:Pedido[]=[]; productos:Producto[]=[]; cargando=false; error='';
 rechazandoId:number|null=null; motivo=''; procesando=new Set<number>();
 form:FormProducto|null=null; guardando=false; errorForm='';
 estados=ESTADOS; detalle=detalle; fondo=fondo; imagenProducto=imagenProducto; iniciales=iniciales; mapaUrl=mapaUrl; precioFinal=precioFinal; siguienteDe=SIGUIENTE;
 ngOnInit(){
  this.catalogo.restaurantes().subscribe({
   next:r=>{this.restaurantes=r;const guardado=r.find(x=>x.id===Number(localStorage.getItem(RESTAURANTE_KEY)));if(guardado)this.seleccionar(guardado);},
   error:()=>this.error='No se pudo conectar con el microservicio de restaurantes (8081).'});
  // Revisa pedidos nuevos cada 15 s
  interval(15000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>{if(this.restaurante)this.cargarPedidos(false);});
 }
 seleccionar(r:Restaurante){this.restaurante=r;localStorage.setItem(RESTAURANTE_KEY,String(r.id));this.cargarPedidos(true);this.cargarProductos();}
 cambiarRestaurante(){this.restaurante=null;this.pedidos=[];this.productos=[];this.form=null;localStorage.removeItem(RESTAURANTE_KEY);}

 // ---- Pedidos entrantes ----
 cargarPedidos(mostrarCarga:boolean){
  if(mostrarCarga)this.cargando=true;
  this.pedidosApi.porRestaurante(this.restaurante!.id).subscribe({
   next:r=>{const nuevos=r.filter(p=>p.estado==='RECIBIDO'&&!this.pedidos.some(x=>x.id===p.id));if(!mostrarCarga&&nuevos.length)this.notificacion.mostrar(`${nuevos.length} pedido(s) nuevo(s) por confirmar`,'info');this.pedidos=r;this.cargando=false;this.error='';},
   error:()=>{this.error='No se pudo conectar con el microservicio de pedidos (8082).';this.cargando=false;}});
 }
 get nuevos(){return this.pedidos.filter(p=>p.estado==='RECIBIDO');}
 get enProceso(){return this.pedidos.filter(p=>['CONFIRMADO','PREPARANDO','EN_CAMINO'].includes(p.estado));}
 get finalizados(){return this.pedidos.filter(p=>['ENTREGADO','RECHAZADO'].includes(p.estado));}
 get lista(){return this.filtro==='nuevos'?this.nuevos:this.filtro==='proceso'?this.enProceso:this.finalizados;}
 get ingresos(){return this.pedidos.filter(p=>p.estado!=='RECHAZADO').reduce((s,p)=>s+Number(p.total),0);}
 cambiarEstado(p:Pedido,estado:EstadoPedido,motivo?:string){
  this.procesando.add(p.id);
  this.pedidosApi.cambiarEstado(p.id,estado,motivo).subscribe({
   next:a=>{this.pedidos=this.pedidos.map(x=>x.id===a.id?a:x);this.procesando.delete(p.id);this.rechazandoId=null;this.motivo='';this.notificacion.mostrar(`Pedido #${a.id}: ${ESTADOS[a.estado].label.toLowerCase()}`);},
   error:e=>{this.procesando.delete(p.id);this.notificacion.mostrar(e.error?.error||'No se pudo actualizar el pedido','error');this.cargarPedidos(false);}});
 }
 rechazar(p:Pedido){this.cambiarEstado(p,'RECHAZADO',this.motivo.trim());}

 // ---- Administracion de productos ----
 cargarProductos(){this.catalogo.productosDe(this.restaurante!.id).subscribe({next:r=>this.productos=r,error:()=>this.error='No se pudieron cargar los productos.'});}
 nuevo(){this.errorForm='';this.form={nombre:'',descripcion:'',precio:null,descuento:0,imagen:'',disponible:true};}
 editar(p:Producto){this.errorForm='';this.form={id:p.id,nombre:p.nombre,descripcion:p.descripcion,precio:p.precio,descuento:p.descuento||0,imagen:p.imagen||'',disponible:p.disponible!==false};}
 get precioPreview(){const f=this.form;return f?.precio?Math.round(f.precio*(100-(f.descuento||0)))/100:0;}
 guardar(){
  const f=this.form!;this.errorForm='';
  if(!f.nombre.trim())return void(this.errorForm='El nombre es obligatorio.');
  if(!f.precio||f.precio<=0)return void(this.errorForm='El precio debe ser mayor a 0.');
  if(f.descuento<0||f.descuento>90)return void(this.errorForm='El descuento debe estar entre 0 y 90%.');
  const body={nombre:f.nombre.trim(),descripcion:f.descripcion.trim(),precio:f.precio,descuento:Math.round(f.descuento||0),imagen:f.imagen.trim(),disponible:f.disponible,restaurante:{id:this.restaurante!.id}};
  this.guardando=true;
  (f.id?this.catalogo.actualizarProducto(f.id,body):this.catalogo.crearProducto(body)).subscribe({
   next:()=>{this.guardando=false;this.form=null;this.cargarProductos();this.notificacion.mostrar(f.id?'Producto actualizado':'Producto creado');},
   error:e=>{this.guardando=false;this.errorForm=e.error?.error||'No se pudo guardar el producto.';}});
 }
 alternarDisponible(p:Producto){
  this.catalogo.actualizarProducto(p.id,{...p,disponible:!p.disponible,restaurante:{id:p.restaurante.id}}).subscribe({
   next:a=>{this.productos=this.productos.map(x=>x.id===a.id?a:x);this.notificacion.mostrar(a.disponible?`${a.nombre} visible en el menú`:`${a.nombre} oculto del menú`,'info');},
   error:()=>this.notificacion.mostrar('No se pudo actualizar el producto','error')});
 }
 eliminar(p:Producto){
  if(!confirm(`¿Eliminar "${p.nombre}" del menú?`))return;
  this.catalogo.eliminarProducto(p.id).subscribe({
   next:()=>{this.productos=this.productos.filter(x=>x.id!==p.id);this.notificacion.mostrar('Producto eliminado');},
   error:()=>this.notificacion.mostrar('No se pudo eliminar el producto','error')});
 }
}
