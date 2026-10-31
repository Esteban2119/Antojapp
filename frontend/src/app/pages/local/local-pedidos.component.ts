import { Component,DestroyRef,OnInit,inject } from '@angular/core';
import { CurrencyPipe,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { PedidosService } from '../../services/pedidos.service';
import { LocalService } from '../../services/local.service';
import { NotificacionService } from '../../services/notificacion.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SIGUIENTE } from '../pedido-detalle/pedido-detalle.component';
import { EstadoPedido,Pedido } from '../../models/models';
import { CUENTAS,ESTADOS,detalle,totales } from '../../utils/utils';
type Filtro='nuevos'|'proceso'|'finalizados';
// Bandeja de pedidos entrantes del restaurante en sesion
@Component({selector:'app-local-pedidos',standalone:true,imports:[CurrencyPipe,DatePipe,FormsModule,RouterLink,IconComponent],templateUrl:'./local-pedidos.component.html',styleUrl:'./local.css'})
export class LocalPedidosComponent implements OnInit {
 private api=inject(PedidosService); private local=inject(LocalService); private notificacion=inject(NotificacionService); private destroyRef=inject(DestroyRef);
 pedidos:Pedido[]=[]; cargando=true; error=''; filtro:Filtro='nuevos';
 rechazandoId:number|null=null; motivo=''; procesando=new Set<number>();
 estados=ESTADOS; siguienteDe=SIGUIENTE; detalle=detalle; totales=totales; cuentas=CUENTAS;
 ngOnInit(){
  this.cargar(true);
  // Revisa pedidos nuevos cada 15 s
  interval(15000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>this.cargar(false));
 }
 cargar(mostrarCarga:boolean){
  if(mostrarCarga)this.cargando=true;
  this.api.porRestaurante(this.local.id).subscribe({
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
  this.api.cambiarEstado(p.id,estado,motivo).subscribe({
   next:a=>{this.pedidos=this.pedidos.map(x=>x.id===a.id?a:x);this.procesando.delete(p.id);this.rechazandoId=null;this.motivo='';this.notificacion.mostrar(`Pedido #${a.id}: ${ESTADOS[a.estado].label.toLowerCase()}`);},
   error:e=>{this.procesando.delete(p.id);this.notificacion.mostrar(e.error?.error||'No se pudo actualizar el pedido','error');this.cargar(false);}});
 }
}
