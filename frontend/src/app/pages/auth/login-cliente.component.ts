import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/icon/icon.component';
import { EMAIL_RE,TELEFONO_RE } from '../../utils/utils';
@Component({selector:'app-login-cliente',standalone:true,imports:[FormsModule,RouterLink,IconComponent],templateUrl:'./login-cliente.component.html',styleUrl:'./auth.css'})
export class LoginClienteComponent {
 private auth=inject(AuthService); private router=inject(Router); private route=inject(ActivatedRoute);
 modo:'ingresar'|'registro'='ingresar';
 form={nombre:'',email:'',telefono:'',password:'',confirmar:''};
 verClave=false; enviando=false; error='';
 cambiar(m:'ingresar'|'registro'){this.modo=m;this.error='';}
 enviar(){
  const f=this.form;this.error='';
  if(!EMAIL_RE.test(f.email.trim()))return void(this.error='Ingresa un correo electrónico válido.');
  if(f.password.length<6)return void(this.error='La contraseña debe tener al menos 6 caracteres.');
  if(this.modo==='registro'){
   if(!f.nombre.trim())return void(this.error='Escribe tu nombre completo.');
   if(!TELEFONO_RE.test(f.telefono.trim()))return void(this.error='Ingresa un número de teléfono válido.');
   if(f.password!==f.confirmar)return void(this.error='Las contraseñas no coinciden.');
  }
  this.enviando=true;
  const peticion=this.modo==='ingresar'?this.auth.login(f.email.trim(),f.password,'CLIENTE'):this.auth.registro({nombre:f.nombre.trim(),email:f.email.trim(),telefono:f.telefono.trim(),password:f.password});
  peticion.subscribe({
   next:()=>this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('volver')||'/cliente/explorar'),
   error:e=>{this.enviando=false;this.error=e.error?.error||'No se pudo conectar con el servidor (8081).';}});
 }
}
