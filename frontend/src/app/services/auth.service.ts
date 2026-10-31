import { Injectable,computed,inject,signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Rol,Sesion } from '../models/models';
// Sesion del usuario (cliente o local) guardada en el navegador
@Injectable({providedIn:'root'}) export class AuthService {
 private http=inject(HttpClient); private router=inject(Router);
 private api='http://localhost:8081/api/auth'; private clave='antojapp_sesion';
 readonly sesion=signal<Sesion|null>(this.leer());
 readonly esCliente=computed(()=>this.sesion()?.rol==='CLIENTE');
 readonly esLocal=computed(()=>this.sesion()?.rol==='LOCAL');
 login(email:string,password:string,rol:Rol){return this.http.post<Sesion>(`${this.api}/login`,{email,password,rol}).pipe(tap(s=>this.guardar(s)));}
 registro(datos:{nombre:string;email:string;telefono:string;password:string}){return this.http.post<Sesion>(`${this.api}/registro`,datos).pipe(tap(s=>this.guardar(s)));}
 inicio(s:Sesion|null=this.sesion()){return s?.rol==='LOCAL'?'/local/pedidos':s?.rol==='CLIENTE'?'/cliente/explorar':'/';}
 logout(){const rol=this.sesion()?.rol;this.sesion.set(null);localStorage.removeItem(this.clave);this.router.navigate([rol==='LOCAL'?'/local/login':'/cliente/login']);}
 private guardar(s:Sesion){this.sesion.set(s);localStorage.setItem(this.clave,JSON.stringify(s));}
 private leer():Sesion|null{try{return JSON.parse(localStorage.getItem(this.clave)||'null');}catch{return null;}}
}
