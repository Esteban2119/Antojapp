package com.antojapp.restaurantes.controller;
import com.antojapp.restaurantes.model.*;
import com.antojapp.restaurantes.repository.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.math.BigDecimal;
import java.util.*;
@RestController @RequestMapping("/api")
@CrossOrigin(origins="http://localhost:4200") // Permite peticiones del frontend Angular
public class CatalogoController {
 private final RestauranteRepository restaurantes; private final ProductoRepository productos;
 public CatalogoController(RestauranteRepository restaurantes,ProductoRepository productos){this.restaurantes=restaurantes;this.productos=productos;}
 @GetMapping("/restaurantes") public List<Restaurante> listarRestaurantes(){return restaurantes.findAll();}
 @PostMapping("/restaurantes") public Restaurante crearRestaurante(@RequestBody Restaurante r){r.id=null;return restaurantes.save(r);}
 @GetMapping("/restaurantes/{id}/productos") public List<Producto> productosDe(@PathVariable Long id){return productos.findByRestauranteIdOrderByIdAsc(id);}
 @GetMapping("/productos") public List<Producto> listarProductos(){return productos.findAll();}
 @PostMapping("/productos") public ResponseEntity<?> crearProducto(@RequestBody Producto p){
  Long restauranteId=p.restaurante==null?null:p.restaurante.id;
  Optional<Restaurante> r=restauranteId==null?Optional.empty():restaurantes.findById(restauranteId);
  if(r.isEmpty())return ResponseEntity.badRequest().body(Map.of("error","Restaurante no válido"));
  String error=validar(p);if(error!=null)return ResponseEntity.badRequest().body(Map.of("error",error));
  p.id=null;p.restaurante=r.get();normalizar(p);return ResponseEntity.ok(productos.save(p));
 }
 @PutMapping("/productos/{id}") public ResponseEntity<?> actualizarProducto(@PathVariable Long id,@RequestBody Producto datos){
  Optional<Producto> actual=productos.findById(id);
  if(actual.isEmpty())return ResponseEntity.notFound().build();
  String error=validar(datos);if(error!=null)return ResponseEntity.badRequest().body(Map.of("error",error));
  Producto p=actual.get();p.nombre=datos.nombre;p.descripcion=datos.descripcion;p.precio=datos.precio;p.imagen=datos.imagen;p.descuento=datos.descuento;p.disponible=datos.disponible;
  normalizar(p);return ResponseEntity.ok(productos.save(p));
 }
 @DeleteMapping("/productos/{id}") public ResponseEntity<Void> borrar(@PathVariable Long id){if(!productos.existsById(id))return ResponseEntity.notFound().build();productos.deleteById(id);return ResponseEntity.noContent().build();}
 private String validar(Producto p){
  if(p.nombre==null||p.nombre.isBlank())return "El nombre es obligatorio";
  if(p.precio==null||p.precio.compareTo(BigDecimal.ZERO)<=0)return "El precio debe ser mayor a 0";
  if(p.descuento!=null&&(p.descuento<0||p.descuento>90))return "El descuento debe estar entre 0 y 90%";
  return null;
 }
 private void normalizar(Producto p){p.nombre=p.nombre.trim();if(p.descuento==null)p.descuento=0;if(p.disponible==null)p.disponible=true;}
}
