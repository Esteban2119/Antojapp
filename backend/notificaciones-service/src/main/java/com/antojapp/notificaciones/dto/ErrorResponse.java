package com.antojapp.notificaciones.dto;

import java.time.LocalDateTime;

// Respuesta uniforme para errores de la API
public class ErrorResponse {
 public String error;
 public LocalDateTime fecha=LocalDateTime.now();

 public ErrorResponse(){}

 public ErrorResponse(String error){this.error=error;}
}
