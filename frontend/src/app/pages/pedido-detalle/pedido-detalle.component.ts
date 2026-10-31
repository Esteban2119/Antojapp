import { Component,DestroyRef,OnInit,inject } from '@angular/core';
import { CurrencyPipe,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { PedidosService } from '../../services/pedidos.service';
import { CatalogoService } from '../../services/catalogo.service';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { IconComponent,IconName } from '../../components/icon/icon.component';
import { MapaVistaComponent } from '../../components/mapa-vista/mapa-vista.component';
import { CuentaPagoComponent } from '../../components/cuenta-pago/cuenta-pago.component';
import { EstadoPedido,Pedido,Restaurante } from '../../models/models';
import { CUENTAS,ESTADOS,FLUJO,detalle,facturaDisponible,mapaUrl,numeroFactura,redondear,totales } from '../../utils/utils';
export const SIGUIENTE:Partial<Record<EstadoPedido,{estado:EstadoPedido;label:string;icono:IconName}>>={
 CONFIRMADO:{estado:'PREPARANDO',label:'Empezar preparación',icono:'flame'},
 PREPARANDO:{estado:'EN_CAMINO',label:'Enviar pedido',icono:'truck'},
 EN_CAMINO:{estado:'ENTREGADO',label:'Marcar entregado',icono:'checkCircle'}};
// Detalle completo de un pedido; el cliente hace seguimiento y el local lo gestiona
@Component({selector:'app-pedido-detalle',standalone:true,imports:[CurrencyPipe,DatePipe,FormsModule,RouterLink,IconComponent,MapaVistaComponent,CuentaPagoComponent],templateUrl:'./pedido-detalle.component.html',styleUrl:'./pedido-detalle.component.css'})
export class PedidoDetalleComponent implements OnInit {
 private route=inject(ActivatedRoute); private api=inject(PedidosService); private catalogo=inject(CatalogoService);
 private notificacion=inject(NotificacionService); private destroyRef=inject(DestroyRef); auth=inject(AuthService);
 pedido:Pedido|null=null; restaurante:Restaurante|null=null; cargando=true; noEncontrado=false;
 rechazando=false; motivo=''; procesando=false;
 estados=ESTADOS; flujo=FLUJO; siguiente=SIGUIENTE; cuentas=CUENTAS; detalle=detalle; totales=totales; numeroFactura=numeroFactura; facturaDisponible=facturaDisponible; mapaUrl=mapaUrl;
 get esLocal(){return this.auth.esLocal();}
 get base(){return this.esLocal?'/local/pedidos':'/cliente/pedidos';}
 get paso(){return this.pedido?FLUJO.indexOf(this.pedido.estado):-1;}
 get vuelto(){const p=this.pedido;return p?.pagaCon?redondear(Number(p.pagaCon)-Number(p.total)):null;}
 ngOnInit(){
  this.cargar();
  interval(20000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>this.cargar());
 }
 cargar(){
  this.api.obtener(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
   next:p=>{
    const s=this.auth.sesion()!;
    // Cada usuario solo puede ver sus propios pedidos
    if(s.rol==='CLIENTE'?p.email!==s.email:p.restauranteId!==s.restauranteId){this.noEncontrado=true;this.cargando=false;return;}
    if(!this.restaurante)this.catalogo.restaurante(p.restauranteId).subscribe(r=>this.restaurante=r);
    this.pedido=p;this.cargando=false;
   },
   error:()=>{this.noEncontrado=true;this.cargando=false;}});
 }
 cambiarEstado(estado:EstadoPedido,motivo?:string){
  this.procesando=true;
  this.api.cambiarEstado(this.pedido!.id,estado,motivo).subscribe({
   next:p=>{this.pedido=p;this.procesando=false;this.rechazando=false;this.notificacion.mostrar(`Pedido #${p.id}: ${ESTADOS[p.estado].label.toLowerCase()}`);},
   error:e=>{this.procesando=false;this.notificacion.mostrar(e.error?.error||'No se pudo actualizar el pedido','error');this.cargar();}});
 }
}
