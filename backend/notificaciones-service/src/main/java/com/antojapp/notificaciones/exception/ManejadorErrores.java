package com.antojapp.notificaciones.exception;

import com.antojapp.notificaciones.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ManejadorErrores {
 private static final Logger log=LoggerFactory.getLogger(ManejadorErrores.class);

 @ExceptionHandler(RecursoNoEncontradoException.class)
 public ResponseEntity<ErrorResponse> noEncontrado(RecursoNoEncontradoException e){
  return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
 }

 @ExceptionHandler(SolicitudInvalidaException.class)
 public ResponseEntity<ErrorResponse> invalida(SolicitudInvalidaException e){
  return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
 }

 @ExceptionHandler(MethodArgumentNotValidException.class)
 public ResponseEntity<ErrorResponse> validacion(MethodArgumentNotValidException e){
  String mensaje=e.getBindingResult().getFieldErrors().stream()
   .findFirst().map(FieldError::getDefaultMessage).orElse("Datos invalidos");
  return ResponseEntity.badRequest().body(new ErrorResponse(mensaje));
 }

 @ExceptionHandler(HttpMessageNotReadableException.class)
 public ResponseEntity<ErrorResponse> cuerpoInvalido(HttpMessageNotReadableException e){
  return ResponseEntity.badRequest().body(new ErrorResponse("El cuerpo JSON no es valido o contiene un valor no permitido"));
 }

 @ExceptionHandler(Exception.class)
 public ResponseEntity<ErrorResponse> general(Exception e){
  log.error("Error no controlado en notificaciones",e);
  return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Error interno del servicio"));
 }
}
