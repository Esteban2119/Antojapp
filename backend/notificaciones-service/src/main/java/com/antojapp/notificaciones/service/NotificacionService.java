package com.antojapp.notificaciones.service;

import com.antojapp.notificaciones.dto.EnviarNotificacionRequest;
import com.antojapp.notificaciones.exception.RecursoNoEncontradoException;
import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.model.EstadoNotificacion;
import com.antojapp.notificaciones.model.MensajeNotificacion;
import com.antojapp.notificaciones.model.PlantillaNotificacion;
import com.antojapp.notificaciones.repository.MensajeNotificacionRepository;
import com.antojapp.notificaciones.repository.PlantillaNotificacionRepository;
import com.antojapp.notificaciones.spec.MensajeNotificacionSpecifications;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class NotificacionService {
  private final PlantillaNotificacionRepository plantillas;
  private final MensajeNotificacionRepository mensajes;
  private final RenderizadorPlantillas renderizador;
  private final Map<CanalNotificacion, NotificacionSender> senders = new EnumMap<>(CanalNotificacion.class);

  public NotificacionService(PlantillaNotificacionRepository plantillas, MensajeNotificacionRepository mensajes,
      RenderizadorPlantillas renderizador, List<NotificacionSender> senders) {
    this.plantillas = plantillas;
    this.mensajes = mensajes;
    this.renderizador = renderizador;
    // Registro de canales disponibles. Para agregar SMS basta crear un bean
    // NotificacionSender que devuelva CanalNotificacion.SMS.
    for (NotificacionSender sender : senders)
      this.senders.put(sender.canal(), sender);
  }

  @Transactional
  public MensajeNotificacion enviar(EnviarNotificacionRequest request) {
    return enviar(request, null);
  }

  /**
   * Variante idempotente usada por el consumer de Kafka. Si la solicitud ya fue
   * procesada no vuelve a renderizar ni a enviar el mensaje. La restriccion
   * unique de solicitudId es la ultima barrera ante una reentrega concurrente.
   */
  @Transactional
  public Optional<MensajeNotificacion> enviarDesdeSolicitud(EnviarNotificacionRequest request, String solicitudId) {
    if (solicitudId != null && !solicitudId.isBlank() && mensajes.existsBySolicitudId(solicitudId))
      return Optional.empty();
    return Optional.of(enviar(request, solicitudId));
  }

  private MensajeNotificacion enviar(EnviarNotificacionRequest request, String solicitudId) {
    String codigo = normalizarCodigo(request.getCodigoPlantilla());
    PlantillaNotificacion plantilla = plantillas.findByCodigoAndActivaTrue(codigo)
        .orElseThrow(() -> new RecursoNoEncontradoException("No existe una plantilla activa con codigo " + codigo));
    Map<String, String> variables = request.getVariables() == null ? new LinkedHashMap<>()
        : new LinkedHashMap<>(request.getVariables());
    CanalNotificacion canal = plantilla.getCanal() == null ? CanalNotificacion.EMAIL : plantilla.getCanal();
    String asunto = renderizador.renderizarTexto(plantilla.getAsunto(), variables);
    if (asunto != null)
      asunto = asunto.replaceAll("[\\r\\n]+", " ").trim();
    MensajeNotificacion mensaje = MensajeNotificacion.builder()
        .canal(canal)
        .destinatario(request.getDestinatario().trim())
        .asunto(asunto)
        .cuerpo(renderizador.renderizarHtml(plantilla.getCuerpo(), variables))
        .codigoPlantilla(plantilla.getCodigo())
        .variables(variables)
        .referencia(request.getReferencia() == null ? null : request.getReferencia().trim())
        .solicitudId(solicitudId == null || solicitudId.isBlank() ? null : solicitudId.trim())
        .build();
    // Se guarda primero como PENDIENTE para no perder el mensaje si el SMTP falla.
    mensaje = mensajes.save(mensaje);
    return despachar(mensaje);
  }

  @Transactional
  public MensajeNotificacion reenviar(Long id) {
    MensajeNotificacion mensaje = mensajes.findById(id)
        .orElseThrow(() -> new RecursoNoEncontradoException("No existe el mensaje " + id));
    return despachar(mensaje);
  }

  // Los filtros se combinan con Specifications para que PostgreSQL resuelva
  // la consulta; cada filtro null se salta dentro de su Specification.
  public List<MensajeNotificacion> listar(EstadoNotificacion estado, CanalNotificacion canal, String destinatario) {
    Specification<MensajeNotificacion> filtros = Specification
        .where(MensajeNotificacionSpecifications.conEstado(estado))
        .and(MensajeNotificacionSpecifications.conCanal(canal))
        .and(MensajeNotificacionSpecifications.conDestinatario(destinatario));
    return mensajes.findAll(filtros, Sort.by(Sort.Direction.DESC, "fechaCreacion"));
  }

  public MensajeNotificacion buscar(Long id) {
    return mensajes.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("No existe el mensaje " + id));
  }

  private MensajeNotificacion despachar(MensajeNotificacion mensaje) {
    NotificacionSender sender = senders.get(mensaje.getCanal());
    mensaje.setIntentos(mensaje.getIntentos() + 1);
    if (sender == null) {
      mensaje.setEstado(EstadoNotificacion.FALLIDO);
      mensaje.setError("No hay implementacion para el canal " + mensaje.getCanal());
      return mensajes.save(mensaje);
    }
    try {
      sender.enviar(mensaje);
      mensaje.setEstado(EstadoNotificacion.ENVIADO);
      mensaje.setFechaEnvio(LocalDateTime.now());
      mensaje.setError(null);
    } catch (Exception e) {
      mensaje.setEstado(EstadoNotificacion.FALLIDO);
      mensaje.setError(limitar(e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage()));
    }
    return mensajes.save(mensaje);
  }

  private String normalizarCodigo(String codigo) {
    return codigo.trim().toUpperCase(Locale.ROOT);
  }

  private String limitar(String texto) {
    return texto.length() <= 1000 ? texto : texto.substring(0, 1000);
  }
}
