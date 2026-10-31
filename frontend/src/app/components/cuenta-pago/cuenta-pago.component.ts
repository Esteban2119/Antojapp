import { Component,Input,inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { NotificacionService } from '../../services/notificacion.service';
import { CuentaPago,Restaurante } from '../../models/models';
import { CUENTAS } from '../../utils/utils';
// Datos a los que el cliente debe transferir (cuenta Banco Pichincha o numero Deuna del local)
@Component({selector:'app-cuenta-pago',standalone:true,imports:[CurrencyPipe,IconComponent],
 template:`
 <div class="cuenta" [class.deuna]="cuenta==='DEUNA'">
  <div class="c-head">
   <img [src]="info.logo" [alt]="info.nombre">
   <div><b>{{restaurante.nombre}}</b><small>{{cuenta==='DEUNA' ? 'Paga desde la app Deuna' : 'Transferencia bancaria'}}</small></div>
   @if (monto) { <strong class="monto">{{monto | currency:'USD':'symbol-narrow'}}</strong> }
  </div>
  <dl>
   @if (cuenta==='PICHINCHA') {
    <div><dt>Banco</dt><dd>Banco Pichincha</dd></div>
    <div><dt>Tipo de cuenta</dt><dd>{{restaurante.tipoCuenta || 'Corriente'}}</dd></div>
    <div><dt>Número de cuenta</dt><dd class="copy">{{restaurante.numeroCuenta || '—'}}<button type="button" (click)="copiar(restaurante.numeroCuenta)" aria-label="Copiar"><app-icon name="copy" [size]="14" /></button></dd></div>
   } @else {
    <div><dt>Número Deuna</dt><dd class="copy">{{restaurante.telefonoDeuna || '—'}}<button type="button" (click)="copiar(restaurante.telefonoDeuna)" aria-label="Copiar"><app-icon name="copy" [size]="14" /></button></dd></div>
   }
   <div><dt>Titular</dt><dd>{{restaurante.titularCuenta || restaurante.nombre}}</dd></div>
   <div><dt>RUC</dt><dd>{{restaurante.ruc || '—'}}</dd></div>
  </dl>
 </div>`,
 styles:[`.cuenta{border:1.5px solid #e8e2d0;border-radius:16px;overflow:hidden;background:#fff}
 .c-head{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fffbe6;border-bottom:1px solid #f1e9c4}
 .deuna .c-head{background:#f2eef8;border-color:#e3dcef}
 .c-head img{height:34px;width:auto;max-width:110px;object-fit:contain;border-radius:8px;background:#fff}
 .c-head>div{flex:1;display:flex;flex-direction:column}
 .c-head small{color:var(--muted);font-size:12px}
 .monto{font-size:18px}
 dl{margin:0;padding:6px 14px 10px;display:grid;grid-template-columns:1fr 1fr;gap:0 16px}
 dl div{padding:8px 0;border-bottom:1px dashed #f1ebe5}
 dt{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
 dd{margin:3px 0 0;font-weight:700;font-size:14px;display:flex;align-items:center;gap:6px}
 .copy button{border:1px solid var(--line);background:#fff;border-radius:7px;width:26px;height:26px;display:grid;place-items:center;color:var(--muted)}
 .copy button:hover{color:var(--primary);border-color:var(--primary-100)}
 @media (max-width:520px){dl{grid-template-columns:1fr}}`]})
export class CuentaPagoComponent {
 private notificacion=inject(NotificacionService);
 @Input({required:true}) restaurante!:Restaurante; @Input({required:true}) cuenta!:CuentaPago; @Input() monto=0;
 get info(){return CUENTAS[this.cuenta];}
 copiar(valor?:string){if(!valor)return;navigator.clipboard?.writeText(valor).then(()=>this.notificacion.mostrar('Copiado al portapapeles','info'));}
}
