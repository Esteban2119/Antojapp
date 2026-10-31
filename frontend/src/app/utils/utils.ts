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
export const mapaUrl=(lat:number,lng:number)=>`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
