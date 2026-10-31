import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { MisPedidosComponent } from './pages/mis-pedidos/mis-pedidos.component';
import { PanelRestauranteComponent } from './pages/panel-restaurante/panel-restaurante.component';
export const routes:Routes=[
 {path:'',component:InicioComponent,title:'AntojApp | Tu comida favorita'},
 {path:'carrito',component:CarritoComponent,title:'Mi carrito | AntojApp'},
 {path:'mis-pedidos',component:MisPedidosComponent,title:'Mis pedidos | AntojApp'},
 {path:'restaurante',component:PanelRestauranteComponent,title:'Panel de restaurante | AntojApp'},
 {path:'**',redirectTo:''}
];
