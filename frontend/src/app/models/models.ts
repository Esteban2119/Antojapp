// Tipos que representan el JSON recibido de la API REST
export interface Restaurante { id:number; nombre:string; descripcion:string; categoria:string; imagen:string; }
export interface Producto { id:number; nombre:string; descripcion:string; precio:number; imagen:string; restaurante:Restaurante; }
export interface ItemCarrito { producto:Producto; cantidad:number; }
export interface Pedido { id:number; cliente:string; direccion:string; estado:string; total:number; detalle:string; fecha:string; }
