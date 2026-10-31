import { Component,ElementRef,OnInit,ViewChild,inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CatalogoService } from '../../services/catalogo.service';
import { CarritoService } from '../../services/carrito.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Producto,Restaurante } from '../../models/models';
import { fondo,imagenProducto,iniciales,precioFinal } from '../../utils/utils';
import { IconComponent } from '../../components/icon/icon.component';
import { MediaComponent } from '../../components/media/media.component';
@Component({selector:'app-inicio',standalone:true,imports:[CurrencyPipe,FormsModule,IconComponent,MediaComponent],templateUrl:'./inicio.component.html',styleUrl:'./inicio.component.css'})
export class InicioComponent implements OnInit {
 private catalogo=inject(CatalogoService); private notificacion=inject(NotificacionService); carrito=inject(CarritoService);
 @ViewChild('catalogoSeccion') catalogoSeccion?:ElementRef<HTMLElement>;
 restaurantes:Restaurante[]=[]; productos:Producto[]=[];
 categoria='Todos'; restauranteId:number|null=null; soloOfertas=false; busqueda=''; cargando=true; error='';
 fondo=fondo; precioFinal=precioFinal; imagenProducto=imagenProducto; iniciales=iniciales;
 ngOnInit(){
  forkJoin([this.catalogo.restaurantes(),this.catalogo.productos()]).subscribe({
   next:([r,p])=>{this.restaurantes=r;this.productos=p;this.carrito.sincronizar(p);this.cargando=false;},
   error:()=>{this.error='No se pudo cargar el catálogo. Revisa que el microservicio de restaurantes (8081) esté encendido.';this.cargando=false;}});
 }
 get disponibles(){return this.productos.filter(p=>p.disponible!==false);}
 get categorias(){return ['Todos',...new Set(this.restaurantes.map(r=>r.categoria).filter(Boolean))];}
 get ofertas(){return this.disponibles.filter(p=>p.descuento>0);}
 // Filtra el catalogo sin alterar la lista original
 get filtrados(){
  const q=this.busqueda.toLowerCase().trim();
  return this.disponibles.filter(p=>(this.categoria==='Todos'||p.restaurante.categoria===this.categoria)&&(!this.restauranteId||p.restaurante.id===this.restauranteId)&&(!this.soloOfertas||p.descuento>0)&&`${p.nombre} ${p.descripcion} ${p.restaurante.nombre}`.toLowerCase().includes(q));
 }
 conteo(r:Restaurante){return this.disponibles.filter(p=>p.restaurante.id===r.id).length;}
 nombreRestaurante(){return this.restaurantes.find(r=>r.id===this.restauranteId)?.nombre;}
 elegirRestaurante(r:Restaurante){this.restauranteId=this.restauranteId===r.id?null:r.id;this.irAlCatalogo();}
 verOfertas(){this.soloOfertas=true;this.irAlCatalogo();}
 limpiar(){this.categoria='Todos';this.restauranteId=null;this.soloOfertas=false;this.busqueda='';}
 agregar(p:Producto){this.carrito.agregar(p);if(this.carrito.cantidadDe(p.id)===1)this.notificacion.mostrar(`${p.nombre} agregado al carrito`);}
 irAlCatalogo(){this.catalogoSeccion?.nativeElement.scrollIntoView({behavior:'smooth'});}
}
