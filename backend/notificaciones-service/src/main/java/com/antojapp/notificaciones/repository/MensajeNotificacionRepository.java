package com.antojapp.notificaciones.repository;

import com.antojapp.notificaciones.model.MensajeNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MensajeNotificacionRepository
    extends JpaRepository<MensajeNotificacion, Long>, JpaSpecificationExecutor<MensajeNotificacion> {
  boolean existsBySolicitudId(String solicitudId);
}
