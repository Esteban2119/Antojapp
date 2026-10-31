import { DetallePedido, EstadoPedido, Pedido, Producto, Restaurante } from '../models/models';
import { IconName } from '../components/icon/icon.component';

export const EMAIL_RE=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const TELEFONO_RE=/^\+?[0-9 ()-]{7,20}$/;
export const EMAIL_KEY='antojapp_email';

// Precio con descuento redondeado a centavos
export const precioFinal=(p:Producto)=>Math.round(p.precio*(100-(p.descuento||0)))/100;

// Si el producto no tiene foto se usa el logo de su restaurante
export const imagenProducto=(p:Producto)=>p.imagen||p.restaurante?.imagen||'';
export const iniciales=(nombre:string)=>(nombre||'').split(/\s+/).filter(w=>w.length>2||/^[A-Z]/.test(w)).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'A';

const FONDOS:Record<string,string>={'Ecuatoriana':'linear-gradient(135deg,#fde7d2,#f9c89b)','Rápida':'linear-gradient(135deg,#fde2dc,#f7b0a0)','Mariscos':'linear-gradient(135deg,#d9f0f2,#a6dbe1)'};
export const fondo=(categoria:string)=>FONDOS[categoria]??'linear-gradient(135deg,#ece8f6,#d3cbe9)';
export const fondoRestaurante=(r:Restaurante)=>fondo(r.categoria);

export const FLUJO:EstadoPedido[]=['RECIBIDO','CONFIRMADO','PREPARANDO','EN_CAMINO','ENTREGADO'];
export const ESTADOS:Record<EstadoPedido,{label:string;icono:IconName}>={
 RECIBIDO:{label:'Recibido',icono:'receipt'},CONFIRMADO:{label:'Confirmado',icono:'check'},RECHAZADO:{label:'Rechazado',icono:'xCircle'},
 PREPARANDO:{label:'Preparando',icono:'flame'},EN_CAMINO:{label:'En camino',icono:'truck'},ENTREGADO:{label:'Entregado',icono:'package'}};

export function detalle(p:Pedido):DetallePedido[]{try{return JSON.parse(p.detalle||'[]');}catch{return [];}}

// Los precios del menu incluyen IVA (15 % en Ecuador); la factura desglosa la base imponible
export const IVA=0.15;
export const redondear=(n:number)=>Math.round(n*100)/100;
export function totales(p:Pedido){
 const items=detalle(p),total=Number(p.total),base=redondear(total/(1+IVA));
 const descuentos=redondear(items.reduce((s,d)=>s+((d.precioOriginal??d.precio)-d.precio)*d.cantidad,0));
 return {total,base,iva:redondear(total-base),descuentos,articulos:items.reduce((s,d)=>s+d.cantidad,0)};
}
export const numeroFactura=(p:Pedido)=>`001-001-${String(p.id).padStart(9,'0')}`;
export const facturaDisponible=(p:Pedido)=>!['RECIBIDO','RECHAZADO'].includes(p.estado);
export const CUENTAS={PICHINCHA:{nombre:'Banco Pichincha',logo:'/img/pagos/banco-pichincha.png'},DEUNA:{nombre:'Deuna',logo:'/img/pagos/deuna.png'}} as const;
export function metodoTexto(p:Pedido){
 if(p.metodoPago==='TRANSFERENCIA')return `Transferencia · ${p.cuentaPago?CUENTAS[p.cuentaPago].nombre:''}`;
 return p.metodoPago==='EFECTIVO'?'Efectivo contra entrega':'No especificado';
}
export const mapaUrl=(lat:number,lng:number)=>`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
