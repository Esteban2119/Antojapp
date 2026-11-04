package com.antojapp.notificaciones.dto;

import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.model.PlantillaNotificacion;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

// Datos que devuelve la API para una plantilla
@Getter
@Builder
public class PlantillaNotificacionResponse {

    private Long id;
    private String codigo;
    private String nombre;
    private CanalNotificacion canal;
    private String asunto;
    private String cuerpo;
    private boolean activa;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    public static PlantillaNotificacionResponse desde(PlantillaNotificacion plantilla) {
        return PlantillaNotificacionResponse.builder()
                .id(plantilla.getId())
                .codigo(plantilla.getCodigo())
                .nombre(plantilla.getNombre())
                .canal(plantilla.getCanal())
                .asunto(plantilla.getAsunto())
                .cuerpo(plantilla.getCuerpo())
                .activa(plantilla.isActiva())
                .fechaCreacion(plantilla.getFechaCreacion())
                .fechaActualizacion(plantilla.getFechaActualizacion())
                .build();
    }
}
