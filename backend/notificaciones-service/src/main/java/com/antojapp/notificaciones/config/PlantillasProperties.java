package com.antojapp.notificaciones.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Asuntos configurables para las plantillas iniciales de notificacion.
 */
@Component
@ConfigurationProperties(prefix = "notificaciones.plantillas")
public class PlantillasProperties {

  private Map<String, String> asuntos = new LinkedHashMap<>();

  public Map<String, String> getAsuntos() {
    return asuntos;
  }

  public void setAsuntos(Map<String, String> asuntos) {
    if (asuntos != null) {
      this.asuntos = new LinkedHashMap<>(asuntos);
    }
  }

  public String asunto(String codigo, String porDefecto) {
    return asuntos.getOrDefault(codigo, porDefecto);
  }
}
