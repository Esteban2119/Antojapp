package com.antojapp.notificaciones.service;

import com.antojapp.notificaciones.dto.PlantillaRequest;
import com.antojapp.notificaciones.exception.RecursoNoEncontradoException;
import com.antojapp.notificaciones.exception.SolicitudInvalidaException;
import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.model.PlantillaNotificacion;
import com.antojapp.notificaciones.repository.PlantillaNotificacionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class PlantillaService {
  private final PlantillaNotificacionRepository repo;

  public PlantillaService(PlantillaNotificacionRepository repo) {
    this.repo = repo;
  }

  // Solo 2 filtros opcionales: la regla de Specifications aplica a partir de 3.
  public List<PlantillaNotificacion> listar(CanalNotificacion canal, Boolean activa) {
    return repo.findAll(Sort.by(Sort.Direction.ASC, "codigo")).stream()
        .filter(p -> canal == null || p.getCanal() == canal)
        .filter(p -> activa == null || p.isActiva() == activa)
        .toList();
  }

  public PlantillaNotificacion buscar(Long id) {
    return repo.findById(id)
        .orElseThrow(() -> new RecursoNoEncontradoException("No existe la plantilla " + id));
  }

  public PlantillaNotificacion buscarPorCodigo(String codigo) {
    String normalizado = normalizarCodigo(codigo);
    return repo.findByCodigo(normalizado)
        .orElseThrow(() -> new RecursoNoEncontradoException("No existe la plantilla " + normalizado));
  }

  @Transactional
  public PlantillaNotificacion crear(PlantillaRequest request) {
    String codigo = normalizarCodigo(request.getCodigo());
    if (repo.existsByCodigo(codigo))
      throw new SolicitudInvalidaException("Ya existe una plantilla con codigo " + codigo);
    PlantillaNotificacion plantilla = PlantillaNotificacion.builder()
        .codigo(codigo)
        .build();
    aplicar(plantilla, request, true);
    return repo.save(plantilla);
  }

  @Transactional
  public PlantillaNotificacion actualizar(Long id, PlantillaRequest request) {
    PlantillaNotificacion plantilla = buscar(id);
    String codigo = normalizarCodigo(request.getCodigo());
    if (!codigo.equals(plantilla.getCodigo()) && repo.existsByCodigo(codigo))
      throw new SolicitudInvalidaException("Ya existe una plantilla con codigo " + codigo);
    plantilla.setCodigo(codigo);
    aplicar(plantilla, request, false);
    plantilla.setFechaActualizacion(LocalDateTime.now());
    return repo.save(plantilla);
  }

  @Transactional
  public void eliminar(Long id) {
    if (!repo.existsById(id))
      throw new RecursoNoEncontradoException("No existe la plantilla " + id);
    repo.deleteById(id);
  }

  private void aplicar(PlantillaNotificacion plantilla, PlantillaRequest request, boolean esNueva) {
    plantilla.setNombre(request.getNombre().trim());
    plantilla.setCanal(request.getCanal() == null ? CanalNotificacion.EMAIL : request.getCanal());
    plantilla.setAsunto(request.getAsunto() == null || request.getAsunto().isBlank() ? null : request.getAsunto().trim());
    plantilla.setCuerpo(request.getCuerpo());
    if (esNueva)
      plantilla.setActiva(request.getActiva() == null || request.getActiva());
    else
      plantilla.setActiva(request.getActiva() == null ? plantilla.isActiva() : request.getActiva());
  }

  private String normalizarCodigo(String codigo) {
    return codigo.trim().toUpperCase(Locale.ROOT);
  }
}
