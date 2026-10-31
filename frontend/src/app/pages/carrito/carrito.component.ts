import { Component,inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';
import { PedidosService } from '../../services/pedidos.service';
import { NotificacionService } from '../../services/notificacion.service';
import { MapaDireccionComponent } from '../../components/mapa-direccion/mapa-direccion.component';
import { Ubicacion } from '../../models/models';
import { EMAIL_KEY,EMAIL_RE,TELEFONO_RE,fondo,imagenProducto,precioFinal } from '../../utils/utils';
import { IconComponent } from '../../components/icon/icon.component';
import { MediaComponent } from '../../components/media/media.component';
@Component({selector:'app-carrito',standalone:true,imports:[CurrencyPipe,FormsModule,RouterLink,MapaDireccionComponent,IconComponent,MediaComponent],templateUrl:'./carrito.component.html',styleUrl:'./carrito.component.css'})
export class CarritoComponent {
 carrito=inject(CarritoService); private pedidos=inject(PedidosService); private router=inject(Router); private notificacion=inject(NotificacionService);
 form={cliente:'',email:localStorage.getItem(EMAIL_KEY)||'',telefono:'',direccion:'',referencia:''};
 ubicacion:{lat:number;lng:number}|null=null; error=''; enviando=false; intentado=false;
 fondo=fondo; precioFinal=precioFinal; imagenProducto=imagenProducto;
 get emailValido(){return EMAIL_RE.test(this.form.email.trim());}
 get telefonoValido(){return TELEFONO_RE.test(this.form.telefono.trim());}
 onUbicacion(u:Ubicacion){this.ubicacion={lat:u.lat,lng:u.lng};if(u.direccion)this.form.direccion=u.direccion;}
 // Crea un pedido por restaurante en el microservicio de pedidos y limpia el carrito solo si todos se guardaron
 confirmar(){
  this.intentado=true;this.error='';
  const f=this.form;
  if(!f.cliente.trim())return void(this.error='Escribe tu nombre.');
  if(!this.emailValido)return void(this.error='Ingresa un correo electrónico válido. Lo usarás para consultar tus pedidos.');
  if(!this.telefonoValido)return void(this.error='Ingresa un número de teléfono válido (mínimo 7 dígitos).');
  if(!this.ubicacion)return void(this.error='Marca tu ubicación de entrega en el mapa.');
  if(!f.direccion.trim())return void(this.error='Escribe la dirección de entrega.');
  const email=f.email.trim().toLowerCase();
  this.enviando=true;
  forkJoin(this.carrito.porRestaurante().map(g=>this.pedidos.crear({
   cliente:f.cliente.trim(),email,telefono:f.telefono.trim(),direccion:f.direccion.trim(),referencia:f.referencia.trim(),
   latitud:this.ubicacion!.lat,longitud:this.ubicacion!.lng,restauranteId:g.restaurante.id,restauranteNombre:g.restaurante.nombre,
   total:Math.round(g.total*100)/100,
   detalle:JSON.stringify(g.items.map(i=>({productoId:i.producto.id,nombre:i.producto.nombre,cantidad:i.cantidad,precio:precioFinal(i.producto),precioOriginal:i.producto.precio,descuento:i.producto.descuento||0})))
  }))).subscribe({
   next:r=>{
    localStorage.setItem(EMAIL_KEY,email);this.carrito.vaciar();
    this.notificacion.mostrar(r.length>1?`${r.length} pedidos registrados, uno por restaurante`:`Pedido #${r[0].id} registrado correctamente`);
    this.router.navigate(['/mis-pedidos'],{queryParams:{email}});
   },
   error:e=>{this.error=e.error?.error||'No se pudo registrar el pedido. Revisa que el microservicio de pedidos (8082) esté encendido.';this.enviando=false;}
  });
 }
}
