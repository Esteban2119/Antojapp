package com.antojapp.pedidos.controller;
import com.antojapp.pedidos.model.Pedido;
import com.antojapp.pedidos.repository.PedidoRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Pattern;
@RestController @RequestMapping("/api/pedidos")
@CrossOrigin(origins="http://localhost:4200")
public class PedidoController {
 private static final Pattern EMAIL=Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
 private static final Pattern TELEFONO=Pattern.compile("^\\+?[0-9 ()-]{7,20}$");
 // Transiciones permitidas: el restaurante confirma o rechaza y luego avanza el pedido
 private static final Map<String,List<String>> TRANSICIONES=Map.of(
  "RECIBIDO",List.of("CONFIRMADO","RECHAZADO"),
  "CONFIRMADO",List.of("PREPARANDO"),
  "PREPARANDO",List.of("EN_CAMINO"),
  "EN_CAMINO",List.of("ENTREGADO"));
 private final PedidoRepository repo;
 public PedidoController(PedidoRepository repo){this.repo=repo;}
 // Los clientes consultan por correo y los restaurantes por su id
 @GetMapping public ResponseEntity<List<Pedido>> listar(@RequestParam(required=false) String email,@RequestParam(required=false) Long restauranteId){
  if(email!=null&&!email.isBlank())return ResponseEntity.ok(repo.findByEmailIgnoreCaseOrderByFechaDesc(email.trim()));
  if(restauranteId!=null)return ResponseEntity.ok(repo.findByRestauranteIdOrderByFechaDesc(restauranteId));
  return ResponseEntity.badRequest().build();
 }
 @GetMapping("/{id}") public ResponseEntity<Pedido> buscar(@PathVariable Long id){return repo.findById(id).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());}
 @PostMapping public ResponseEntity<?> crear(@RequestBody Pedido pedido){
  String error=validar(pedido);
  if(error!=null)return ResponseEntity.badRequest().body(Map.of("error",error));
  pedido.id=null;pedido.estado="RECIBIDO";pedido.motivoRechazo=null;pedido.fecha=java.time.LocalDateTime.now();
  pedido.email=pedido.email.trim().toLowerCase();pedido.cliente=pedido.cliente.trim();pedido.telefono=pedido.telefono.trim();
  return ResponseEntity.ok(repo.save(pedido));
 }
 @PatchMapping("/{id}/estado") public ResponseEntity<?> actualizar(@PathVariable Long id,@RequestBody Map<String,String> body){
  Optional<Pedido> encontrado=repo.findById(id);
  if(encontrado.isEmpty())return ResponseEntity.notFound().build();
  Pedido p=encontrado.get();String estado=body.get("estado");
  if(!TRANSICIONES.getOrDefault(p.estado,List.of()).contains(estado))return ResponseEntity.badRequest().body(Map.of("error","No se puede pasar de "+p.estado+" a "+estado));
  p.estado=estado;
  if("RECHAZADO".equals(estado))p.motivoRechazo=body.getOrDefault("motivo","");
  return ResponseEntity.ok(repo.save(p));
 }
 private String validar(Pedido p){
  if(p.cliente==null||p.cliente.isBlank())return "El nombre es obligatorio";
  if(p.email==null||!EMAIL.matcher(p.email.trim()).matches())return "Correo electrónico no válido";
  if(p.telefono==null||!TELEFONO.matcher(p.telefono.trim()).matches())return "Número de teléfono no válido";
  if(p.direccion==null||p.direccion.isBlank())return "La dirección es obligatoria";
  if(p.restauranteId==null)return "El restaurante es obligatorio";
  if(p.total==null||p.total.compareTo(BigDecimal.ZERO)<=0)return "Total no válido";
  return null;
 }
}
