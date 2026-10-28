package com.antojapp.pedidos.controller;
import com.antojapp.pedidos.model.Pedido;
import com.antojapp.pedidos.repository.PedidoRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;
@RestController @RequestMapping("/api/pedidos")
@CrossOrigin(origins="http://localhost:4200")
public class PedidoController {
 private final PedidoRepository repo;
 public PedidoController(PedidoRepository repo){this.repo=repo;}
 @GetMapping public List<Pedido> listar(){return repo.findAll();}
 @GetMapping("/{id}") public ResponseEntity<Pedido> buscar(@PathVariable Long id){return repo.findById(id).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());}
 @PostMapping public Pedido crear(@RequestBody Pedido pedido){pedido.id=null;pedido.estado="RECIBIDO";pedido.fecha=java.time.LocalDateTime.now();return repo.save(pedido);}
 @PatchMapping("/{id}/estado") public ResponseEntity<Pedido> actualizar(@PathVariable Long id,@RequestBody Map<String,String> body){return repo.findById(id).map(p->{String estado=body.get("estado");if(!List.of("RECIBIDO","PREPARANDO","EN_CAMINO","ENTREGADO").contains(estado))return ResponseEntity.badRequest().<Pedido>build();p.estado=estado;return ResponseEntity.ok(repo.save(p));}).orElseGet(()->ResponseEntity.notFound().build());}
}
