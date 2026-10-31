import { AfterViewInit,Component,ElementRef,EventEmitter,NgZone,OnDestroy,Output,ViewChild,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Ubicacion } from '../../models/models';
import { IconComponent } from '../icon/icon.component';
const QUITO:L.LatLngTuple=[-0.1807,-78.4678];
const NOMINATIM='https://nominatim.openstreetmap.org';
// Mapa OpenStreetMap: el usuario marca su ubicacion y se obtiene la direccion escrita
@Component({selector:'app-mapa-direccion',standalone:true,imports:[FormsModule,IconComponent],templateUrl:'./mapa-direccion.component.html',styleUrl:'./mapa-direccion.component.css'})
export class MapaDireccionComponent implements AfterViewInit,OnDestroy {
 private zone=inject(NgZone);
 @ViewChild('mapa',{static:true}) contenedor!:ElementRef<HTMLDivElement>;
 @Output() ubicacion=new EventEmitter<Ubicacion>();
 busqueda=''; buscando=false; localizando=false; mensaje='';
 private mapa?:L.Map; private marcador?:L.Marker;
 private icono=L.divIcon({className:'map-pin',html:'<span></span>',iconSize:[34,34],iconAnchor:[17,34]});
 ngAfterViewInit(){
  this.zone.runOutsideAngular(()=>{
   this.mapa=L.map(this.contenedor.nativeElement,{center:QUITO,zoom:13});
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(this.mapa);
   this.mapa.on('click',e=>this.zone.run(()=>this.colocar(e.latlng.lat,e.latlng.lng,true)));
   setTimeout(()=>this.mapa?.invalidateSize(),200);
  });
 }
 ngOnDestroy(){this.mapa?.remove();}
 private colocar(lat:number,lng:number,buscarDireccion:boolean,direccion?:string){
  this.zone.runOutsideAngular(()=>{
   if(!this.marcador){
    this.marcador=L.marker([lat,lng],{draggable:true,icon:this.icono}).addTo(this.mapa!);
    this.marcador.on('dragend',()=>{const p=this.marcador!.getLatLng();this.zone.run(()=>this.colocar(p.lat,p.lng,true));});
   }else this.marcador.setLatLng([lat,lng]);
   this.mapa!.setView([lat,lng],Math.max(this.mapa!.getZoom(),16));
  });
  this.mensaje='';
  this.ubicacion.emit({lat,lng,direccion});
  if(buscarDireccion)this.direccionDe(lat,lng);
 }
 private async direccionDe(lat:number,lng:number){
  try{
   const r=await fetch(`${NOMINATIM}/reverse?format=jsonv2&accept-language=es&lat=${lat}&lon=${lng}`);
   const d=await r.json();
   if(d?.display_name)this.ubicacion.emit({lat,lng,direccion:this.resumir(d)});
  }catch{this.mensaje='Ubicación marcada. No se pudo obtener la dirección escrita, escríbela manualmente.';}
 }
 async buscar(){
  const q=this.busqueda.trim();if(!q)return;
  this.buscando=true;this.mensaje='';
  try{
   const r=await fetch(`${NOMINATIM}/search?format=jsonv2&limit=1&countrycodes=ec&accept-language=es&q=${encodeURIComponent(q)}`);
   const [d]=await r.json();
   if(d)this.colocar(Number(d.lat),Number(d.lon),false,this.resumir(d));else this.mensaje='No encontramos esa dirección. Prueba marcándola directamente en el mapa.';
  }catch{this.mensaje='No se pudo buscar la dirección. Revisa tu conexión.';}
  finally{this.buscando=false;}
 }
 miUbicacion(){
  if(!navigator.geolocation){this.mensaje='Tu navegador no permite obtener la ubicación.';return;}
  this.localizando=true;
  navigator.geolocation.getCurrentPosition(
   pos=>this.zone.run(()=>{this.localizando=false;this.colocar(pos.coords.latitude,pos.coords.longitude,true);}),
   ()=>this.zone.run(()=>{this.localizando=false;this.mensaje='No pudimos acceder a tu ubicación. Marca el punto en el mapa.';}),
   {enableHighAccuracy:true,timeout:10000});
 }
 // Direccion corta: calle, numero, barrio y ciudad
 private resumir(d:any){
  const a=d.address;if(!a)return d.display_name;
  const partes=[[a.road,a.house_number].filter(Boolean).join(' '),a.neighbourhood||a.suburb,a.city||a.town||a.village].filter(Boolean);
  return partes.length?partes.join(', '):d.display_name;
 }
}
