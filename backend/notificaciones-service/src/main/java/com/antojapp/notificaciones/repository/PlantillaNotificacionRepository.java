package com.antojapp.notificaciones.repository;

import com.antojapp.notificaciones.model.PlantillaNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PlantillaNotificacionRepository extends JpaRepository<PlantillaNotificacion,Long>{
 Optional<PlantillaNotificacion> findByCodigo(String codigo);
 Optional<PlantillaNotificacion> findByCodigoAndActivaTrue(String codigo);
 boolean existsByCodigo(String codigo);
}
