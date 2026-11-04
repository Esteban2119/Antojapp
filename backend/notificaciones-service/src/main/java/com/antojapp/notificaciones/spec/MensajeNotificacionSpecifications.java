package com.antojapp.notificaciones.spec;

import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.model.EstadoNotificacion;
import com.antojapp.notificaciones.model.MensajeNotificacion;
import org.springframework.data.jpa.domain.Specification;

import java.util.Locale;

/**
 * Un Specification por filtro opcional del listado de mensajes. Cada metodo
 * devuelve null cuando el filtro no llega, de modo que where()/and() lo
 * saltan y la consulta queda con los demas filtros.
 */
public final class MensajeNotificacionSpecifications {

  private MensajeNotificacionSpecifications() {
  }

  public static Specification<MensajeNotificacion> conEstado(EstadoNotificacion estado) {
    if (estado == null)
      return null;
    return (root, query, cb) -> cb.equal(root.get("estado"), estado);
  }

  public static Specification<MensajeNotificacion> conCanal(CanalNotificacion canal) {
    if (canal == null)
      return null;
    return (root, query, cb) -> cb.equal(root.get("canal"), canal);
  }

  public static Specification<MensajeNotificacion> conDestinatario(String destinatario) {
    if (destinatario == null || destinatario.isBlank())
      return null;
    String buscado = destinatario.trim().toLowerCase(Locale.ROOT);
    return (root, query, cb) -> cb.equal(cb.lower(root.get("destinatario")), buscado);
  }
}
