package com.antojapp.notificaciones.controller;

import com.antojapp.notificaciones.dto.PlantillaNotificacionResponse;
import com.antojapp.notificaciones.dto.PlantillaRequest;
import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.service.PlantillaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plantillas")
@CrossOrigin(origins="http://localhost:4200")
public class PlantillaController {
 private final PlantillaService service;

 public PlantillaController(PlantillaService service){this.service=service;}

 @GetMapping
 public List<PlantillaNotificacionResponse> listar(@RequestParam(required=false) CanalNotificacion canal,
                                                   @RequestParam(required=false) Boolean activa){
  return service.listar(canal,activa).stream()
   .map(PlantillaNotificacionResponse::desde)
   .toList();
 }

 @GetMapping("/{id}")
 public PlantillaNotificacionResponse buscar(@PathVariable Long id){
  return PlantillaNotificacionResponse.desde(service.buscar(id));
 }

 @GetMapping("/codigo/{codigo}")
 public PlantillaNotificacionResponse buscarPorCodigo(@PathVariable String codigo){
  return PlantillaNotificacionResponse.desde(service.buscarPorCodigo(codigo));
 }

 @PostMapping
 public ResponseEntity<PlantillaNotificacionResponse> crear(@Valid @RequestBody PlantillaRequest request){
  return ResponseEntity.status(HttpStatus.CREATED)
   .body(PlantillaNotificacionResponse.desde(service.crear(request)));
 }

 @PutMapping("/{id}")
 public PlantillaNotificacionResponse actualizar(@PathVariable Long id,@Valid @RequestBody PlantillaRequest request){
  return PlantillaNotificacionResponse.desde(service.actualizar(id,request));
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> eliminar(@PathVariable Long id){
  service.eliminar(id);
  return ResponseEntity.noContent().build();
 }
}
