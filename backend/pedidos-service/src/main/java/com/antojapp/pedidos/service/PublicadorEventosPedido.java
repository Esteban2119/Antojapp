package com.antojapp.pedidos.service;

import com.antojapp.pedidos.evento.SolicitudNotificacion;
import com.antojapp.pedidos.model.Pedido;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/**
 * Publica en Kafka una solicitud de notificacion por cada alta y cambio de
 * estado de un pedido, ya traducida a la forma que espera
 * notificaciones-service (destinatario, plantilla y variables).
 *
 * El envio es best-effort: si Kafka no esta disponible, el pedido se guarda
 * igual y el fallo solo queda en el log, sin romper la API de pedidos.
 */
@Service
public class PublicadorEventosPedido {

  private static final Logger log = LoggerFactory.getLogger(PublicadorEventosPedido.class);

  // Estado del pedido -> plantilla de notificacion que corresponde enviar.
  // Los estados sin plantilla (por ejemplo PREPARANDO) no generan solicitud.
  private static final Map<String, String> PLANTILLAS = Map.of(
      "RECIBIDO", "PEDIDO_RECIBIDO",
      "CONFIRMADO", "PEDIDO_CONFIRMADO",
      "EN_CAMINO", "PEDIDO_EN_CAMINO",
      "ENTREGADO", "PEDIDO_ENTREGADO",
      "RECHAZADO", "PEDIDO_RECHAZADO");

  private final KafkaTemplate<Object, Object> kafkaTemplate;
  private final String topic;
  private final boolean habilitado;

  public PublicadorEventosPedido(
      KafkaTemplate<Object, Object> kafkaTemplate,
      @Value("${pedidos.kafka.topic-notificaciones:notificaciones-solicitadas}") String topic,
      @Value("${pedidos.kafka.habilitado:true}") boolean habilitado) {
    this.kafkaTemplate = kafkaTemplate;
    this.topic = topic;
    this.habilitado = habilitado;
  }

  public void publicar(Pedido pedido) {
    if (!habilitado)
      return;

    String codigoPlantilla = PLANTILLAS.get(estado(pedido));
    if (codigoPlantilla == null)
      return;

    SolicitudNotificacion solicitud = new SolicitudNotificacion(
        UUID.randomUUID().toString(),
        pedido.email,
        codigoPlantilla,
        variables(pedido),
        String.valueOf(pedido.id));

    try {
      // La clave es el id del pedido: las solicitudes del mismo pedido
      // mantienen el orden dentro de la misma particion.
      kafkaTemplate.send(topic, String.valueOf(pedido.id), solicitud)
          .whenComplete((resultado, error) -> {
            if (error != null)
              log.error("No se pudo publicar la solicitud {} del pedido {}", solicitud.solicitudId(), pedido.id, error);
            else
              log.info("Solicitud {} publicada para el pedido {} en estado {}",
                  solicitud.solicitudId(), pedido.id, pedido.estado);
          });
    } catch (Exception e) {
      // Cubre fallos sincronos (por ejemplo, metadata no disponible).
      log.error("Kafka no disponible; el pedido {} quedo guardado sin solicitud de notificacion", pedido.id, e);
    }
  }

  private String estado(Pedido pedido) {
    return pedido.estado == null ? "" : pedido.estado.trim().toUpperCase(Locale.ROOT);
  }

  private Map<String, String> variables(Pedido pedido) {
    Map<String, String> variables = new LinkedHashMap<>();
    variables.put("cliente", texto(pedido.cliente, "Cliente"));
    variables.put("pedidoId", String.valueOf(pedido.id));
    variables.put("restaurante", texto(pedido.restauranteNombre, "el restaurante"));
    variables.put("total", pedido.total == null ? "0" : pedido.total.toPlainString());
    variables.put("motivo", texto(pedido.motivoRechazo, "No especificado"));
    return variables;
  }

  private String texto(String valor, String porDefecto) {
    return valor == null || valor.isBlank() ? porDefecto : valor.trim();
  }
}
