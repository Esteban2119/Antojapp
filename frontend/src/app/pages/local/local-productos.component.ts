import { Component,OnInit,inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../services/catalogo.service';
import { LocalService } from '../../services/local.service';
import { NotificacionService } from '../../services/notificacion.service';
import { IconComponent } from '../../components/icon/icon.component';
import { MediaComponent } from '../../components/media/media.component';
import { Producto } from '../../models/models';
import { fondo,imagenProducto,precioFinal } from '../../utils/utils';
interface FormProducto { id?:number; nombre:string; descripcion:string; precio:number|null; descuento:number; imagen:string; disponible:boolean; }
// Administracion del menu: productos, precios, descuentos y disponibilidad
@Component({selector:'app-local-productos',standalone:true,imports:[CurrencyPipe,FormsModule,IconComponent,MediaComponent],templateUrl:'./local-productos.component.html',styleUrl:'./local.css'})
export class LocalProductosComponent implements OnInit {
 private catalogo=inject(CatalogoService); private notificacion=inject(NotificacionService); local=inject(LocalService);
 productos:Producto[]=[]; cargando=true; busqueda='';
 form:FormProducto|null=null; guardando=false; errorForm='';
 fondo=fondo; precioFinal=precioFinal; imagenProducto=imagenProducto;
 ngOnInit(){this.cargar();}
 cargar(){this.catalogo.productosDe(this.local.id).subscribe({next:r=>{this.productos=r;this.cargando=false;},error:()=>{this.cargando=false;this.notificacion.mostrar('No se pudieron cargar los productos','error');}});}
 get filtrados(){const q=this.busqueda.toLowerCase().trim();return this.productos.filter(p=>p.nombre.toLowerCase().includes(q));}
 get conDescuento(){return this.productos.filter(p=>p.descuento>0).length;}
 get ocultos(){return this.productos.filter(p=>!p.disponible).length;}
 nuevo(){this.errorForm='';this.form={nombre:'',descripcion:'',precio:null,descuento:0,imagen:'',disponible:true};}
 editar(p:Producto){this.errorForm='';this.form={id:p.id,nombre:p.nombre,descripcion:p.descripcion,precio:p.precio,descuento:p.descuento||0,imagen:p.imagen||'',disponible:p.disponible!==false};}
 get precioPreview(){const f=this.form;return f?.precio?Math.round(f.precio*(100-(f.descuento||0)))/100:0;}
 guardar(){
  const f=this.form!;this.errorForm='';
  if(!f.nombre.trim())return void(this.errorForm='El nombre es obligatorio.');
  if(!f.precio||f.precio<=0)return void(this.errorForm='El precio debe ser mayor a 0.');
  if(f.descuento<0||f.descuento>90)return void(this.errorForm='El descuento debe estar entre 0 y 90%.');
  const body={nombre:f.nombre.trim(),descripcion:f.descripcion.trim(),precio:f.precio,descuento:Math.round(f.descuento||0),imagen:f.imagen.trim(),disponible:f.disponible,restaurante:{id:this.local.id}};
  this.guardando=true;
  (f.id?this.catalogo.actualizarProducto(f.id,body):this.catalogo.crearProducto(body)).subscribe({
   next:()=>{this.guardando=false;this.form=null;this.cargar();this.notificacion.mostrar(f.id?'Producto actualizado':'Producto creado');},
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
