package com.antojapp.notificaciones.controller;

import com.antojapp.notificaciones.dto.EnviarNotificacionRequest;
import com.antojapp.notificaciones.dto.MensajeNotificacionResponse;
import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.model.EstadoNotificacion;
import com.antojapp.notificaciones.service.NotificacionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins="http://localhost:4200")
public class NotificacionController {
 private final NotificacionService service;

 public NotificacionController(NotificacionService service){this.service=service;}

 // Renderiza el template y encola el mensaje. Si el SMTP falla, el mensaje
 // queda guardado con estado FALLIDO para poder reenviarlo despues.
 @PostMapping
 public ResponseEntity<MensajeNotificacionResponse> enviar(@Valid @RequestBody EnviarNotificacionRequest request){
  return ResponseEntity.status(HttpStatus.CREATED)
   .body(MensajeNotificacionResponse.desde(service.enviar(request)));
 }

 @PostMapping("/{id}/reenviar")
 public MensajeNotificacionResponse reenviar(@PathVariable Long id){
  return MensajeNotificacionResponse.desde(service.reenviar(id));
 }

 @GetMapping
 public List<MensajeNotificacionResponse> listar(@RequestParam(required=false) EstadoNotificacion estado,
                                                 @RequestParam(required=false) CanalNotificacion canal,
                                                 @RequestParam(required=false) String destinatario){
  return service.listar(estado,canal,destinatario).stream()
   .map(MensajeNotificacionResponse::desde)
   .toList();
 }

 @GetMapping("/{id}")
 public MensajeNotificacionResponse buscar(@PathVariable Long id){
  return MensajeNotificacionResponse.desde(service.buscar(id));
 }
}
