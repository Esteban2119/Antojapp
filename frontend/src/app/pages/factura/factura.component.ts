import { Component,ElementRef,OnInit,ViewChild,inject } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';
import { CurrencyPipe,DatePipe } from '@angular/common';
import { ActivatedRoute,RouterLink } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { CatalogoService } from '../../services/catalogo.service';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/icon/icon.component';
import { MediaComponent } from '../../components/media/media.component';
import { Pedido,Restaurante } from '../../models/models';
import { CUENTAS,detalle,facturaDisponible,fondo,iniciales,numeroFactura,redondear,totales } from '../../utils/utils';
// Factura del pedido con desglose de IVA, lista para imprimir o guardar como PDF
@Component({selector:'app-factura',standalone:true,imports:[CurrencyPipe,DatePipe,RouterLink,IconComponent,MediaComponent],templateUrl:'./factura.component.html',styleUrl:'./factura.component.css'})
export class FacturaComponent implements OnInit {
 private route=inject(ActivatedRoute); private api=inject(PedidosService); private catalogo=inject(CatalogoService); auth=inject(AuthService);
 private notificacion=inject(NotificacionService);
 @ViewChild('factura') facturaEl?:ElementRef<HTMLElement>;
 pedido:Pedido|null=null; restaurante:Restaurante|null=null; cargando=true; error=''; descargando=false;
 detalle=detalle; totales=totales; numeroFactura=numeroFactura; cuentas=CUENTAS; fondo=fondo; iniciales=iniciales;
 get base(){return this.auth.esLocal()?'/local/pedidos':'/cliente/pedidos';}
 ngOnInit(){
  const id=Number(this.route.snapshot.paramMap.get('id'));
  this.api.obtener(id).subscribe({
   next:p=>{
    const s=this.auth.sesion()!;
    if(s.rol==='CLIENTE'?p.email!==s.email:p.restauranteId!==s.restauranteId){this.error='Esta factura no pertenece a tu cuenta.';this.cargando=false;return;}
    if(!facturaDisponible(p)){this.error=p.estado==='RECHAZADO'?'No se emite factura para pedidos rechazados.':'La factura estará disponible cuando el restaurante confirme el pedido.';this.cargando=false;return;}
    this.pedido=p;
    this.catalogo.restaurante(p.restauranteId).subscribe({next:r=>{this.restaurante=r;this.cargando=false;},error:()=>this.cargando=false});
   },
   error:()=>{this.error='No se encontró el pedido.';this.cargando=false;}});
 }
 // Precios sin IVA por linea para el detalle de la factura
 sinIva(v:number){return redondear(v/1.15);}
 imprimir(){window.print();}
 // Genera el PDF en el navegador y lo descarga directamente (librerias cargadas bajo demanda)
 async descargarPdf(){
  const el=this.facturaEl?.nativeElement;if(!el||!this.pedido)return;
  this.descargando=true;
  try{
   const [{default:html2canvas},{jsPDF}]=await Promise.all([import('html2canvas'),import('jspdf')]);
   const canvas=await html2canvas(el,{scale:2,backgroundColor:'#ffffff',useCORS:true,ignoreElements:e=>e.classList.contains('bg')});
   const pdf=new jsPDF({unit:'mm',format:'a4'});
   const margen=10,ancho=210-margen*2,pagina=297-margen*2,alto=canvas.height*ancho/canvas.width;
   const img=canvas.toDataURL('image/jpeg',0.95);
   // Si la factura es mas larga que una hoja, continua en paginas adicionales
   for(let y=0;y<alto;y+=pagina){if(y>0)pdf.addPage();pdf.addImage(img,'JPEG',margen,margen-y,ancho,alto);}
   pdf.save(`Factura-${numeroFactura(this.pedido)}.pdf`);
   this.notificacion.mostrar('Factura descargada');
  }catch{this.notificacion.mostrar('No se pudo generar el PDF','error');}
  finally{this.descargando=false;}
 }
}
