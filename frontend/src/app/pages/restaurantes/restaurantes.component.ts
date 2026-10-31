import { Component,OnInit,inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../services/catalogo.service';
import { CarritoService } from '../../services/carrito.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Producto,Restaurante } from '../../models/models';
import { fondo,imagenProducto,iniciales,precioFinal } from '../../utils/utils';
import { IconComponent } from '../../components/icon/icon.component';
import { MediaComponent } from '../../components/media/media.component';
@Component({selector:'app-restaurantes',standalone:true,imports:[CurrencyPipe,FormsModule,IconComponent,MediaComponent],templateUrl:'./restaurantes.component.html',styleUrl:'./restaurantes.component.css'})
export class RestaurantesComponent implements OnInit {
 private catalogo=inject(CatalogoService); private notificacion=inject(NotificacionService);
 carrito=inject(CarritoService);
 restaurantes:Restaurante[]=[]; productos:Producto[]=[];
 categoria='Todos'; busqueda=''; cargando=true; cargandoMenu=false; error='';
 seleccionado:Restaurante|null=null;
 fondo=fondo; imagenProducto=imagenProducto; iniciales=iniciales; precioFinal=precioFinal;
 ngOnInit(){
  this.catalogo.restaurantes().subscribe({
   next:r=>{this.restaurantes=r;this.cargando=false;},
   error:()=>{this.error='No se pudo conectar con el servicio de restaurantes (8081).';this.cargando=false;}});
 }
 get categorias(){return ['Todos',...new Set(this.restaurantes.map(r=>r.categoria).filter(Boolean))];}
 // Filtra el listado de locales sin alterar la lista original
 get filtrados(){
  const q=this.busqueda.toLowerCase().trim();
  return this.restaurantes.filter(r=>(this.categoria==='Todos'||r.categoria===this.categoria)&&`${r.nombre} ${r.descripcion}`.toLowerCase().includes(q));
 }
 get menu(){return this.productos.filter(p=>p.disponible!==false);}
 // Abre la carta del restaurante elegido consultando solo sus productos
 verMenu(r:Restaurante){
  this.seleccionado=r;this.productos=[];this.error='';this.cargandoMenu=true;
  this.catalogo.productosDe(r.id).subscribe({
   next:p=>{this.productos=p;this.cargandoMenu=false;},
   error:()=>{this.error='No se pudo cargar el menú del restaurante.';this.cargandoMenu=false;}});
  window.scrollTo({top:0,behavior:'smooth'});
 }
 volver(){this.seleccionado=null;this.productos=[];this.error='';}
 agregar(p:Producto){this.carrito.agregar(p);if(this.carrito.cantidadDe(p.id)===1)this.notificacion.mostrar(`${p.nombre} agregado al carrito`);}
}
