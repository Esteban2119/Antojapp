package com.antojapp.restaurantes.controller;
import com.antojapp.restaurantes.model.Usuario;
import com.antojapp.restaurantes.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.regex.Pattern;
@RestController @RequestMapping("/api/auth")
@CrossOrigin(origins="http://localhost:4200")
public class AuthController {
 private static final Pattern EMAIL=Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
 private static final Pattern TELEFONO=Pattern.compile("^\\+?[0-9 ()-]{7,20}$");
 public record Registro(String nombre,String email,String telefono,String password){}
 public record Login(String email,String password,String rol){}
 private final UsuarioRepository usuarios; private final BCryptPasswordEncoder encoder;
 public AuthController(UsuarioRepository usuarios,BCryptPasswordEncoder encoder){this.usuarios=usuarios;this.encoder=encoder;}
 // Solo los clientes pueden registrarse; las cuentas de los locales las crea la plataforma
 @PostMapping("/registro") public ResponseEntity<?> registro(@RequestBody Registro r){
  if(r.nombre()==null||r.nombre().isBlank())return error(HttpStatus.BAD_REQUEST,"El nombre es obligatorio");
  if(r.email()==null||!EMAIL.matcher(r.email().trim()).matches())return error(HttpStatus.BAD_REQUEST,"Correo electrónico no válido");
  if(r.telefono()==null||!TELEFONO.matcher(r.telefono().trim()).matches())return error(HttpStatus.BAD_REQUEST,"Número de teléfono no válido");
  if(r.password()==null||r.password().length()<6)return error(HttpStatus.BAD_REQUEST,"La contraseña debe tener al menos 6 caracteres");
  String email=r.email().trim().toLowerCase();
  if(usuarios.existsByEmailIgnoreCase(email))return error(HttpStatus.CONFLICT,"Ya existe una cuenta con ese correo");
  Usuario u=usuarios.save(new Usuario(r.nombre().trim(),email,r.telefono().trim(),encoder.encode(r.password()),"CLIENTE",null));
  return ResponseEntity.ok(sesion(u));
 }
 @PostMapping("/login") public ResponseEntity<?> login(@RequestBody Login l){
  Optional<Usuario> u=l.email()==null?Optional.empty():usuarios.findByEmailIgnoreCase(l.email().trim());
  if(u.isEmpty()||l.password()==null||!encoder.matches(l.password(),u.get().passwordHash))return error(HttpStatus.UNAUTHORIZED,"Correo o contraseña incorrectos");
  if(l.rol()!=null&&!l.rol().equals(u.get().rol))return error(HttpStatus.FORBIDDEN,"LOCAL".equals(l.rol())?"Esta cuenta no pertenece a un restaurante":"Esta cuenta es de un restaurante: ingresa desde el acceso para locales");
  return ResponseEntity.ok(sesion(u.get()));
 }
 private Map<String,Object> sesion(Usuario u){
  Map<String,Object> m=new LinkedHashMap<>();
  m.put("id",u.id);m.put("nombre",u.nombre);m.put("email",u.email);m.put("telefono",u.telefono);m.put("rol",u.rol);
  m.put("restauranteId",u.restaurante==null?null:u.restaurante.id);m.put("restauranteNombre",u.restaurante==null?null:u.restaurante.nombre);
  return m;
 }
 private ResponseEntity<Map<String,String>> error(HttpStatus s,String msg){return ResponseEntity.status(s).body(Map.of("error",msg));}
}
