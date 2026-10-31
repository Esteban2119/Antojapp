import { Injectable, signal } from '@angular/core';
export interface Notificacion { tipo:'ok'|'error'|'info'; texto:string; }
@Injectable({providedIn:'root'}) export class NotificacionService {
 readonly actual=signal<Notificacion|null>(null);
 private timer?:ReturnType<typeof setTimeout>;
 mostrar(texto:string,tipo:Notificacion['tipo']='ok'){this.actual.set({tipo,texto});clearTimeout(this.timer);this.timer=setTimeout(()=>this.actual.set(null),3800);}
 cerrar(){this.actual.set(null);}
}
