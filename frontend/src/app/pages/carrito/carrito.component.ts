import { Component,OnInit,inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';
import { PedidosService } from '../../services/pedidos.service';
import { CatalogoService } from '../../services/catalogo.service';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { MapaDireccionComponent } from '../../components/mapa-direccion/mapa-direccion.component';
import { CuentaPagoComponent } from '../../components/cuenta-pago/cuenta-pago.component';
import { IconComponent } from '../../components/icon/icon.component';
import { MediaComponent } from '../../components/media/media.component';
import { CuentaPago,MetodoPago,Restaurante,Ubicacion } from '../../models/models';
import { CUENTAS,IVA,TELEFONO_RE,fondo,imagenProducto,precioFinal,redondear } from '../../utils/utils';
@Component({selector:'app-carrito',standalone:true,imports:[CurrencyPipe,FormsModule,RouterLink,MapaDireccionComponent,CuentaPagoComponent,IconComponent,MediaComponent],templateUrl:'./carrito.component.html',styleUrl:'./carrito.component.css'})
export class CarritoComponent implements OnInit {
 carrito=inject(CarritoService); private pedidos=inject(PedidosService); private catalogo=inject(CatalogoService); private auth=inject(AuthService);
 private router=inject(Router); private notificacion=inject(NotificacionService);
 private sesion=this.auth.sesion()!;
 // El correo es el de la cuenta: asi los pedidos quedan enlazados al cliente
 form={cliente:this.sesion.nombre,email:this.sesion.email,telefono:this.sesion.telefono||'',direccion:'',referencia:''};
 ubicacion:{lat:number;lng:number}|null=null; error=''; enviando=false; intentado=false;
 metodo:MetodoPago|null=null; cuenta:CuentaPago='PICHINCHA'; opciones:CuentaPago[]=['PICHINCHA','DEUNA']; pagaCon:number|null=null; comprobantes:Record<number,string>={};
 conFactura=false; factura={identificacion:'',razonSocial:this.sesion.nombre};
 restaurantes=new Map<number,Restaurante>();
 fondo=fondo; precioFinal=precioFinal; imagenProducto=imagenProducto; cuentas=CUENTAS;
 ngOnInit(){this.catalogo.restaurantes().subscribe(r=>this.restaurantes=new Map(r.map(x=>[x.id,x])));}
 get telefonoValido(){return TELEFONO_RE.test(this.form.telefono.trim());}
 get identificacionValida(){return /^(\d{10}|\d{13})$/.test(this.factura.identificacion.trim());}
 get base(){return redondear(this.carrito.total()/(1+IVA));}
 get iva(){return redondear(this.carrito.total()-this.base);}
 get vuelto(){return this.pagaCon&&this.pagaCon>=this.carrito.total()?redondear(this.pagaCon-this.carrito.total()):null;}
 get billetes(){const t=this.carrito.total();return [5,10,20,50,100].filter(b=>b>t).slice(0,3);}
 restauranteDe(id:number,fallback:Restaurante){return this.restaurantes.get(id)??fallback;}
 onUbicacion(u:Ubicacion){this.ubicacion={lat:u.lat,lng:u.lng};if(u.direccion)this.form.direccion=u.direccion;}
 // Crea un pedido por restaurante en el microservicio de pedidos y limpia el carrito solo si todos se guardaron
 confirmar(){
  this.intentado=true;this.error='';
  const f=this.form,grupos=this.carrito.porRestaurante();
  if(!f.cliente.trim())return void(this.error='Escribe tu nombre.');
  if(!this.telefonoValido)return void(this.error='Ingresa un número de teléfono válido (mínimo 7 dígitos).');
  if(!this.ubicacion)return void(this.error='Marca tu ubicación de entrega en el mapa.');
  if(!f.direccion.trim())return void(this.error='Escribe la dirección de entrega.');
  if(!this.metodo)return void(this.error='Selecciona un método de pago.');
  if(this.metodo==='EFECTIVO'&&this.pagaCon!=null&&this.pagaCon<this.carrito.total())return void(this.error='El monto con el que pagas no puede ser menor al total.');
  if(this.metodo==='TRANSFERENCIA'&&grupos.some(g=>!this.comprobantes[g.restaurante.id]?.trim()))return void(this.error='Ingresa el número de comprobante de cada transferencia.');
  if(this.conFactura&&!this.identificacionValida)return void(this.error='La cédula debe tener 10 dígitos o el RUC 13.');
  if(this.conFactura&&!this.factura.razonSocial.trim())return void(this.error='Escribe el nombre o razón social para la factura.');
  this.enviando=true;
  forkJoin(grupos.map(g=>this.pedidos.crear({
   cliente:f.cliente.trim(),email:f.email,telefono:f.telefono.trim(),direccion:f.direccion.trim(),referencia:f.referencia.trim(),
   latitud:this.ubicacion!.lat,longitud:this.ubicacion!.lng,restauranteId:g.restaurante.id,restauranteNombre:g.restaurante.nombre,
   total:redondear(g.total),metodoPago:this.metodo!,
   // Con varios restaurantes el efectivo se entrega por separado, el vuelto solo aplica a un pedido unico
   pagaCon:this.metodo==='EFECTIVO'&&grupos.length===1?this.pagaCon:null,
   cuentaPago:this.metodo==='TRANSFERENCIA'?this.cuenta:null,comprobante:this.metodo==='TRANSFERENCIA'?this.comprobantes[g.restaurante.id].trim():null,
   identificacion:this.conFactura?this.factura.identificacion.trim():'',razonSocial:this.conFactura?this.factura.razonSocial.trim():'',
   detalle:JSON.stringify(g.items.map(i=>({productoId:i.producto.id,nombre:i.producto.nombre,cantidad:i.cantidad,precio:precioFinal(i.producto),precioOriginal:i.producto.precio,descuento:i.producto.descuento||0})))
  }))).subscribe({
   next:r=>{
    this.carrito.vaciar();
    this.notificacion.mostrar(r.length>1?`${r.length} pedidos registrados, uno por restaurante`:`Pedido #${r[0].id} registrado correctamente`);
    this.router.navigate(r.length===1?['/cliente/pedidos',r[0].id]:['/cliente/pedidos']);
   },
   error:e=>{this.error=e.error?.error||'No se pudo registrar el pedido. Revisa que el microservicio de pedidos (8082) esté encendido.';this.enviando=false;}
  });
 }
}
