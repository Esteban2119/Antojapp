package com.antojapp.notificaciones.model;

// Canales soportados por el servicio. Agregar SMS o PUSH solo requiere
// implementar NotificacionSender y registrar el nuevo valor aqui.
public enum CanalNotificacion { EMAIL, SMS, PUSH }
