import { Component,DestroyRef,OnInit,inject } from '@angular/core';
import { CurrencyPipe,DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { PedidosService } from '../../services/pedidos.service';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/icon/icon.component';
import { Pedido } from '../../models/models';
import { ESTADOS,FLUJO,facturaDisponible,metodoTexto,totales } from '../../utils/utils';
// Pedidos enlazados al correo de la cuenta del cliente
@Component({selector:'app-mis-pedidos',standalone:true,imports:[CurrencyPipe,DatePipe,RouterLink,IconComponent],templateUrl:'./mis-pedidos.component.html',styleUrl:'./mis-pedidos.component.css'})
export class MisPedidosComponent implements OnInit {
 private api=inject(PedidosService); private destroyRef=inject(DestroyRef); auth=inject(AuthService);
 pedidos:Pedido[]=[]; cargando=true; error=''; filtro:'activos'|'historial'='activos';
 estados=ESTADOS; metodoTexto=metodoTexto; facturaDisponible=facturaDisponible; totales=totales;
 ngOnInit(){
  this.cargar();
  // Refresca el seguimiento cada 20 s mientras la pantalla este abierta
  interval(20000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>this.cargar());
 }
 cargar(){
  this.api.porEmail(this.auth.sesion()!.email).subscribe({
   next:r=>{this.pedidos=r;this.cargando=false;this.error='';if(this.filtro==='activos'&&!this.activos.length&&this.historial.length)this.filtro='historial';},
   error:()=>{this.error='No se pudo conectar con el microservicio de pedidos (8082).';this.cargando=false;}});
 }
 get activos(){return this.pedidos.filter(p=>!['ENTREGADO','RECHAZADO'].includes(p.estado));}
 get historial(){return this.pedidos.filter(p=>['ENTREGADO','RECHAZADO'].includes(p.estado));}
 get lista(){return this.filtro==='activos'?this.activos:this.historial;}
 progreso(p:Pedido){return p.estado==='RECHAZADO'?100:(FLUJO.indexOf(p.estado)/(FLUJO.length-1))*100;}
}
