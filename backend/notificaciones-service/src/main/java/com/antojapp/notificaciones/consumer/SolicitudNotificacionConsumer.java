package com.antojapp.notificaciones.consumer;

import com.antojapp.notificaciones.dto.EnviarNotificacionRequest;
import com.antojapp.notificaciones.dto.SolicitudNotificacion;
import com.antojapp.notificaciones.exception.SolicitudInvalidaException;
import com.antojapp.notificaciones.service.NotificacionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;

/**
 * Consumer de las solicitudes de notificacion que publican otros servicios.
 * Kafka solo confirma el offset cuando el metodo termina sin excepcion; si
 * falla, DefaultErrorHandler reintenta y finalmente publica el mensaje en el
 * topic notificaciones-solicitadas-dlt.
 *
 * No se capturan excepciones aqui a proposito: hacerlo impediria los
 * reintentos y la trazabilidad en la cola de errores.
 */
@Component
public class SolicitudNotificacionConsumer {

  private static final Logger log = LoggerFactory.getLogger(SolicitudNotificacionConsumer.class);

  private final NotificacionService notificaciones;

  public SolicitudNotificacionConsumer(NotificacionService notificaciones) {
    this.notificaciones = notificaciones;
  }

  @KafkaListener(
      topics = "${notificaciones.kafka.topic-solicitudes:notificaciones-solicitadas}",
      groupId = "${notificaciones.kafka.group-id:notificaciones-service}")
  public void consumir(SolicitudNotificacion solicitud) {
    validar(solicitud);

    EnviarNotificacionRequest request = EnviarNotificacionRequest.builder()
        .codigoPlantilla(solicitud.codigoPlantilla().trim())
        .destinatario(solicitud.destinatario().trim())
        .variables(solicitud.variables() == null ? new LinkedHashMap<>()
            : new LinkedHashMap<>(solicitud.variables()))
        .referencia(solicitud.referencia())
        .build();

    boolean enviada = notificaciones.enviarDesdeSolicitud(request, solicitud.solicitudId()).isPresent();
    if (enviada)
      log.info("Notificacion {} enviada a {} (solicitud {})",
          request.getCodigoPlantilla(), request.getDestinatario(), solicitud.solicitudId());
    else
      log.info("Solicitud {} ya procesada; se omite el envio duplicado", solicitud.solicitudId());
  }

  // Una solicitud sin destinatario ni plantilla no se arregla reintentando:
  // SolicitudInvalidaException esta en la lista de errores no reintentables y
  // el mensaje termina en la cola de errores (DLT).
  private void validar(SolicitudNotificacion solicitud) {
    if (solicitud == null)
      throw new SolicitudInvalidaException("La solicitud de notificacion llego vacia");
    if (solicitud.solicitudId() == null || solicitud.solicitudId().isBlank())
      throw new SolicitudInvalidaException("La solicitud no tiene solicitudId");
    if (solicitud.destinatario() == null || solicitud.destinatario().isBlank())
      throw new SolicitudInvalidaException("La solicitud no tiene destinatario");
    if (solicitud.codigoPlantilla() == null || solicitud.codigoPlantilla().isBlank())
      throw new SolicitudInvalidaException("La solicitud no tiene codigoPlantilla");
  }
}
