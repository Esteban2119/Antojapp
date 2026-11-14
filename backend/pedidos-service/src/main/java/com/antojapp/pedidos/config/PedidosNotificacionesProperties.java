package com.antojapp.pedidos.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Mapeo configurable entre el estado de un pedido y el codigo de plantilla
 * enviado a notificaciones-service.
 */
@Component
@ConfigurationProperties(prefix = "pedidos.notificaciones")
public class PedidosNotificacionesProperties {

  private Map<String, String> plantillas = new LinkedHashMap<>(Map.of(
      "RECIBIDO", "PEDIDO_RECIBIDO",
      "CONFIRMADO", "PEDIDO_CONFIRMADO",
      "EN_CAMINO", "PEDIDO_EN_CAMINO",
      "ENTREGADO", "PEDIDO_ENTREGADO",
      "RECHAZADO", "PEDIDO_RECHAZADO"));

  public Map<String, String> getPlantillas() {
    return plantillas;
  }

  public void setPlantillas(Map<String, String> plantillas) {
    if (plantillas != null && !plantillas.isEmpty()) {
      this.plantillas = new LinkedHashMap<>(plantillas);
    }
  }
}
