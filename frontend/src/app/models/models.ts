// Tipos que representan el JSON recibido de la API REST
export interface Restaurante {
 id:number; nombre:string; descripcion:string; categoria:string; imagen:string;
 ruc?:string; direccion?:string; titularCuenta?:string; numeroCuenta?:string; tipoCuenta?:string; telefonoDeuna?:string;
}
export interface Producto { id:number; nombre:string; descripcion:string; precio:number; imagen:string; descuento:number; disponible:boolean; restaurante:Restaurante; }
export interface ItemCarrito { producto:Producto; cantidad:number; }
export type EstadoPedido='RECIBIDO'|'CONFIRMADO'|'RECHAZADO'|'PREPARANDO'|'EN_CAMINO'|'ENTREGADO';
export type MetodoPago='EFECTIVO'|'TRANSFERENCIA';
export type CuentaPago='PICHINCHA'|'DEUNA';
export interface Pedido {
 id:number; cliente:string; email:string; telefono:string; direccion:string; referencia?:string;
 latitud?:number; longitud?:number; restauranteId:number; restauranteNombre:string; motivoRechazo?:string;
 metodoPago?:MetodoPago; pagaCon?:number|null; cuentaPago?:CuentaPago|null; comprobante?:string|null;
 identificacion?:string; razonSocial?:string;
 estado:EstadoPedido; total:number; detalle:string; fecha:string;
}
export type NuevoPedido=Omit<Pedido,'id'|'estado'|'fecha'|'motivoRechazo'>;
export interface DetallePedido { productoId:number; nombre:string; cantidad:number; precio:number; precioOriginal?:number; descuento?:number; }
export interface Ubicacion { lat:number; lng:number; direccion?:string; }
export type Rol='CLIENTE'|'LOCAL';
export interface Sesion { id:number; nombre:string; email:string; telefono:string; rol:Rol; restauranteId:number|null; restauranteNombre:string|null; }
