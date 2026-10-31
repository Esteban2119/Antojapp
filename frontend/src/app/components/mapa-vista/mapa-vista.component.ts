import { AfterViewInit,Component,ElementRef,Input,NgZone,OnDestroy,ViewChild,inject } from '@angular/core';
import * as L from 'leaflet';
// Mapa de solo lectura con el punto de entrega
@Component({selector:'app-mapa-vista',standalone:true,template:`<div #mapa class="map"></div>`,
 styles:[':host{display:block;border-radius:16px;overflow:hidden;border:1px solid var(--line)}.map{height:220px;width:100%;z-index:0}']})
export class MapaVistaComponent implements AfterViewInit,OnDestroy {
 private zone=inject(NgZone);
 @ViewChild('mapa',{static:true}) el!:ElementRef<HTMLDivElement>;
 @Input({required:true}) lat!:number; @Input({required:true}) lng!:number;
 private mapa?:L.Map;
 ngAfterViewInit(){
  this.zone.runOutsideAngular(()=>{
   this.mapa=L.map(this.el.nativeElement,{center:[this.lat,this.lng],zoom:16,scrollWheelZoom:false});
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(this.mapa);
   L.marker([this.lat,this.lng],{icon:L.divIcon({className:'map-pin',html:'<span></span>',iconSize:[34,34],iconAnchor:[17,34]})}).addTo(this.mapa);
   setTimeout(()=>this.mapa?.invalidateSize(),200);
  });
 }
 ngOnDestroy(){this.mapa?.remove();}
}
