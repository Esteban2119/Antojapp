import { Component,Input,OnChanges } from '@angular/core';
import { IconComponent,IconName } from '../icon/icon.component';
// Muestra una imagen completa (logo o foto) sobre un fondo difuminado de la misma imagen.
// Si no hay imagen o falla la carga, muestra iniciales o un icono sobre un degradado.
@Component({selector:'app-media',standalone:true,imports:[IconComponent],
 template:`@if (src && !fallo) {
  <img class="bg" [src]="src" alt="" aria-hidden="true">
  <img class="fg" [src]="src" [alt]="alt" (error)="fallo=true" loading="lazy">
 } @else {
  <div class="ph" [style.background]="fondo">@if (texto) {<span>{{texto}}</span>} @else {<app-icon [name]="icono" [size]="28" [stroke]="1.6" />}</div>
 }`,
 styles:[`:host{position:relative;display:block;overflow:hidden;background:#fff}
 .bg{position:absolute;inset:-12px;width:calc(100% + 24px);height:calc(100% + 24px);object-fit:cover;filter:blur(18px) saturate(1.2);opacity:.45;transform:scale(1.1)}
 .fg{position:relative;width:100%;height:100%;object-fit:contain;display:block}
 :host(.cover) .fg{object-fit:cover}
 .ph{width:100%;height:100%;display:grid;place-items:center;color:rgba(28,25,23,.55)}
 .ph span{font-weight:800;letter-spacing:-.02em;font-size:var(--media-text,22px);color:rgba(28,25,23,.7)}`]})
export class MediaComponent implements OnChanges {
 @Input() src=''; @Input() alt=''; @Input() texto=''; @Input() icono:IconName='utensils';
 @Input() fondo='linear-gradient(135deg,#f5efe9,#e9dfd5)';
 fallo=false;
 ngOnChanges(){this.fallo=false;}
}
