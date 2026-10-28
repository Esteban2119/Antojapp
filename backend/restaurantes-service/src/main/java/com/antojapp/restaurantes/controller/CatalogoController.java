package com.antojapp.restaurantes.controller;
import com.antojapp.restaurantes.model.*;
import com.antojapp.restaurantes.repository.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;
@RestController @RequestMapping("/api")
@CrossOrigin(origins="http://localhost:4200") // Permite peticiones del frontend Angular
public class CatalogoController {
 private final RestauranteRepository restaurantes; private final ProductoRepository productos;
 public CatalogoController(RestauranteRepository restaurantes,ProductoRepository productos){this.restaurantes=restaurantes;this.productos=productos;}
 @GetMapping("/restaurantes") public List<Restaurante> listarRestaurantes(){return restaurantes.findAll();}
 @PostMapping("/restaurantes") public Restaurante crearRestaurante(@RequestBody Restaurante r){r.id=null;return restaurantes.save(r);}
 @GetMapping("/productos") public List<Producto> listarProductos(){return productos.findAll();}
 @PostMapping("/productos") public Producto crearProducto(@RequestBody Producto p){p.id=null;return productos.save(p);}
 @DeleteMapping("/productos/{id}") public ResponseEntity<Void> borrar(@PathVariable Long id){if(!productos.existsById(id))return ResponseEntity.notFound().build();productos.deleteById(id);return ResponseEntity.noContent().build();}
}
