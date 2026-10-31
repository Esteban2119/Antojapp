import { Routes } from '@angular/router';
import { rolGuard,sinSesionGuard } from './guards/auth.guards';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { LoginClienteComponent } from './pages/auth/login-cliente.component';
import { LoginLocalComponent } from './pages/auth/login-local.component';
import { ClienteLayoutComponent } from './layouts/cliente-layout.component';
import { LocalLayoutComponent } from './layouts/local-layout.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { MisPedidosComponent } from './pages/mis-pedidos/mis-pedidos.component';
import { PedidoDetalleComponent } from './pages/pedido-detalle/pedido-detalle.component';
import { FacturaComponent } from './pages/factura/factura.component';
import { LocalPedidosComponent } from './pages/local/local-pedidos.component';
import { LocalProductosComponent } from './pages/local/local-productos.component';
import { LocalConfiguracionComponent } from './pages/local/local-configuracion.component';
export const routes:Routes=[
 {path:'',component:BienvenidaComponent,canActivate:[sinSesionGuard],title:'AntojApp | Tu comida favorita'},
 {path:'cliente/login',component:LoginClienteComponent,canActivate:[sinSesionGuard],title:'Ingresar | AntojApp'},
 {path:'local/login',component:LoginLocalComponent,canActivate:[sinSesionGuard],title:'Acceso para restaurantes | AntojApp'},
 // Area del cliente
 {path:'cliente',component:ClienteLayoutComponent,canActivate:[rolGuard('CLIENTE')],children:[
  {path:'',pathMatch:'full',redirectTo:'explorar'},
  {path:'explorar',component:InicioComponent,title:'Explorar | AntojApp'},
  {path:'carrito',component:CarritoComponent,title:'Mi carrito | AntojApp'},
  {path:'pedidos',component:MisPedidosComponent,title:'Mis pedidos | AntojApp'},
  {path:'pedidos/:id',component:PedidoDetalleComponent,title:'Detalle del pedido | AntojApp'},
  {path:'pedidos/:id/factura',component:FacturaComponent,title:'Factura | AntojApp'}]},
 // Area del restaurante
 {path:'local',component:LocalLayoutComponent,canActivate:[rolGuard('LOCAL')],children:[
  {path:'',pathMatch:'full',redirectTo:'pedidos'},
  {path:'pedidos',component:LocalPedidosComponent,title:'Pedidos | Panel AntojApp'},
  {path:'pedidos/:id',component:PedidoDetalleComponent,title:'Detalle del pedido | Panel AntojApp'},
  {path:'pedidos/:id/factura',component:FacturaComponent,title:'Factura | Panel AntojApp'},
  {path:'productos',component:LocalProductosComponent,title:'Productos | Panel AntojApp'},
  {path:'configuracion',component:LocalConfiguracionComponent,title:'Configuración | Panel AntojApp'}]},
 {path:'**',redirectTo:''}
];
