package com.antojapp.notificaciones.service;

import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.model.MensajeNotificacion;

/**
 * Contrato de envio. Cada canal (correo, SMS, push, WhatsApp...) implementa
 * esta interfaz y se registra como bean de Spring. NotificacionService los
 * descubre automaticamente, por lo que agregar un canal no obliga a modificar
 * la logica de negocio.
 */
public interface NotificacionSender {
 CanalNotificacion canal();
 void enviar(MensajeNotificacion mensaje);
}
