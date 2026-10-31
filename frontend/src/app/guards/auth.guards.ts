import { inject } from '@angular/core';
import { CanActivateFn,Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/models';
// Solo deja pasar al rol indicado; si no, envia a su pantalla de acceso
export const rolGuard=(rol:Rol):CanActivateFn=>(_,state)=>{
 const auth=inject(AuthService),router=inject(Router),s=auth.sesion();
 if(s?.rol===rol)return true;
 if(s)return router.parseUrl(auth.inicio(s));
 return router.createUrlTree([rol==='LOCAL'?'/local/login':'/cliente/login'],{queryParams:{volver:state.url}});
};
// Las pantallas de acceso y bienvenida redirigen si ya hay sesion
export const sinSesionGuard:CanActivateFn=()=>{
 const auth=inject(AuthService);
 return auth.sesion()?inject(Router).parseUrl(auth.inicio()):true;
};
