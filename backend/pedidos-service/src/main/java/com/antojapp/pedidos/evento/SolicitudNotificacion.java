package com.antojapp.pedidos.evento;

import java.util.Map;

/**
 * Solicitud de notificacion que pedidos-service publica en Kafka cuando se
 * crea un pedido o cambia su estado. pedidos traduce su propio evento de
 * negocio a esta forma: contiene solo lo que notificaciones-service necesita
 * y no menciona estados ni conceptos de pedidos. Si se agrega o cambia un
 * campo, hay que actualizar tambien el record homonimo del consumer.
 *
 * solicitudId es un UUID generado aqui y permite que el consumer sea
 * idempotente: si Kafka reentrega el mismo mensaje, no se envia dos veces.
 */
public record SolicitudNotificacion(
    String solicitudId,
    String destinatario,
    String codigoPlantilla,
    Map<String, String> variables,
    String referencia) {
}
