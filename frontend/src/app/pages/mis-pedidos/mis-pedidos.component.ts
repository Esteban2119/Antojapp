import { Component,DestroyRef,OnInit,inject } from '@angular/core';
import { CurrencyPipe,DatePipe,NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { PedidosService } from '../../services/pedidos.service';
import { Pedido } from '../../models/models';
import { EMAIL_KEY,EMAIL_RE,ESTADOS,FLUJO,detalle } from '../../utils/utils';
import { IconComponent } from '../../components/icon/icon.component';
// Los pedidos quedan enlazados al correo: para verlos hay que ingresarlo
@Component({selector:'app-mis-pedidos',standalone:true,imports:[CurrencyPipe,DatePipe,NgTemplateOutlet,FormsModule,RouterLink,IconComponent],templateUrl:'./mis-pedidos.component.html',styleUrl:'./mis-pedidos.component.css'})
export class MisPedidosComponent implements OnInit {
 private api=inject(PedidosService); private route=inject(ActivatedRoute); private router=inject(Router); private destroyRef=inject(DestroyRef);
 emailInput=localStorage.getItem(EMAIL_KEY)||''; email=''; pedidos:Pedido[]=[]; cargando=false; error='';
 estados=ESTADOS; flujo=FLUJO; detalle=detalle;
 ngOnInit(){
  const q=this.route.snapshot.queryParamMap.get('email');
  if(q){this.emailInput=q;this.consultar();}
  // Refresca el seguimiento cada 20 s mientras la pantalla este abierta
  interval(20000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>{if(this.email)this.cargar(false);});
 }
 consultar(){
  const e=this.emailInput.trim().toLowerCase();
  if(!EMAIL_RE.test(e)){this.error='Ingresa un correo electrónico válido.';return;}
  this.email=e;localStorage.setItem(EMAIL_KEY,e);
  this.router.navigate([],{queryParams:{email:e},replaceUrl:true});
  this.cargar(true);
 }
 cargar(mostrarCarga:boolean){
  this.error='';if(mostrarCarga)this.cargando=true;
  this.api.porEmail(this.email).subscribe({next:r=>{this.pedidos=r;this.cargando=false;},error:()=>{this.error='No se pudo conectar con el microservicio de pedidos (8082).';this.cargando=false;}});
 }
 cambiarCorreo(){this.email='';this.pedidos=[];this.router.navigate([],{queryParams:{},replaceUrl:true});}
 get activos(){return this.pedidos.filter(p=>!['ENTREGADO','RECHAZADO'].includes(p.estado));}
 get historial(){return this.pedidos.filter(p=>['ENTREGADO','RECHAZADO'].includes(p.estado));}
 paso(p:Pedido){return FLUJO.indexOf(p.estado);}
 info(p:Pedido){return ESTADOS[p.estado];}
}
