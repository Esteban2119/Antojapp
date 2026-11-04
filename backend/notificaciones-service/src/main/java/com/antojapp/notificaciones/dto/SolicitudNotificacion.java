package com.antojapp.notificaciones.dto;

import java.util.Map;

/**
 * Mensaje que otros servicios publican para pedir una notificacion. Contiene
 * solo lo que este servicio necesita: cada productor traduce su propio evento
 * de negocio a esta forma, por lo que aqui no hay vocabulario de pedidos ni
 * de ningun otro dominio.
 *
 * solicitudId es un UUID generado por el productor y permite que el consumer
 * sea idempotente: si Kafka reentrega el mismo mensaje, no se envia dos veces.
 */
public record SolicitudNotificacion(
    String solicitudId,
    String destinatario,
    String codigoPlantilla,
    Map<String, String> variables,
    String referencia) {
}
