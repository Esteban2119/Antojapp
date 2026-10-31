import { Component,OnInit,effect,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../services/catalogo.service';
import { LocalService } from '../../services/local.service';
import { NotificacionService } from '../../services/notificacion.service';
import { IconComponent } from '../../components/icon/icon.component';
import { MediaComponent } from '../../components/media/media.component';
import { CuentaPagoComponent } from '../../components/cuenta-pago/cuenta-pago.component';
import { Restaurante } from '../../models/models';
import { fondo,iniciales } from '../../utils/utils';
// Informacion del local y datos bancarios que ven los clientes al pagar por transferencia
@Component({selector:'app-local-configuracion',standalone:true,imports:[FormsModule,IconComponent,MediaComponent,CuentaPagoComponent],templateUrl:'./local-configuracion.component.html',styleUrl:'./local.css'})
export class LocalConfiguracionComponent implements OnInit {
 private catalogo=inject(CatalogoService); private notificacion=inject(NotificacionService); local=inject(LocalService);
 form:Restaurante|null=null; guardando=false; error='';
 fondo=fondo; iniciales=iniciales;
 constructor(){effect(()=>{const r=this.local.restaurante();if(r&&!this.form)this.form={...r};});}
 ngOnInit(){this.local.cargar();}
 guardar(){
  const f=this.form!;this.error='';
  if(!f.nombre?.trim())return void(this.error='El nombre del local es obligatorio.');
  if(f.ruc&&!/^\d{13}$/.test(f.ruc.trim()))return void(this.error='El RUC debe tener 13 dígitos.');
  if(f.numeroCuenta&&!/^\d{6,20}$/.test(f.numeroCuenta.trim()))return void(this.error='El número de cuenta solo debe contener dígitos.');
  if(f.telefonoDeuna&&!/^09\d{8}$/.test(f.telefonoDeuna.trim()))return void(this.error='El número Deuna debe ser un celular de 10 dígitos (09…).');
  this.guardando=true;
  this.catalogo.actualizarRestaurante(f.id,f).subscribe({
   next:r=>{this.guardando=false;this.local.actualizar(r);this.form={...r};this.notificacion.mostrar('Configuración guardada');},
   error:e=>{this.guardando=false;this.error=e.error?.error||'No se pudo guardar la configuración.';}});
 }
}
