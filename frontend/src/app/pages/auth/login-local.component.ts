import { Component,OnInit,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CatalogoService } from '../../services/catalogo.service';
import { IconComponent } from '../../components/icon/icon.component';
import { Restaurante } from '../../models/models';
@Component({selector:'app-login-local',standalone:true,imports:[FormsModule,RouterLink,IconComponent],templateUrl:'./login-local.component.html',styleUrl:'./auth.css'})
export class LoginLocalComponent implements OnInit {
 private auth=inject(AuthService); private catalogo=inject(CatalogoService); private router=inject(Router); private route=inject(ActivatedRoute);
 email=''; password=''; verClave=false; enviando=false; error=''; restaurantes:Restaurante[]=[];
 ngOnInit(){this.catalogo.restaurantes().subscribe({next:r=>this.restaurantes=r,error:()=>{}});}
 // Mismo formato que las cuentas de demostracion creadas por el backend
 correoDe(r:Restaurante){return r.nombre.normalize('NFD').replace(/[^A-Za-z0-9]/g,'').toLowerCase()+'@antojapp.com';}
 usar(r:Restaurante){this.email=this.correoDe(r);this.password='local123';this.error='';}
 enviar(){
  if(!this.email.trim()||!this.password)return void(this.error='Ingresa el correo y la contraseña del local.');
  this.enviando=true;this.error='';
  this.auth.login(this.email.trim(),this.password,'LOCAL').subscribe({
   next:()=>this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('volver')||'/local/pedidos'),
   error:e=>{this.enviando=false;this.error=e.error?.error||'No se pudo conectar con el servidor (8081).';}});
 }
}
