package com.antojapp.notificaciones.dto;

import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.model.EstadoNotificacion;
import com.antojapp.notificaciones.model.MensajeNotificacion;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

// Datos que devuelve la API para un mensaje de notificacion
@Getter
@Builder
public class MensajeNotificacionResponse {

    private Long id;
    private CanalNotificacion canal;
    private String destinatario;
    private String asunto;
    private String cuerpo;
    private String codigoPlantilla;
    private Map<String, String> variables;
    private EstadoNotificacion estado;
    private String error;
    private int intentos;
    private String referencia;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaEnvio;

    public static MensajeNotificacionResponse desde(MensajeNotificacion mensaje) {
        return MensajeNotificacionResponse.builder()
                .id(mensaje.getId())
                .canal(mensaje.getCanal())
                .destinatario(mensaje.getDestinatario())
                .asunto(mensaje.getAsunto())
                .cuerpo(mensaje.getCuerpo())
                .codigoPlantilla(mensaje.getCodigoPlantilla())
                .variables(mensaje.getVariables() == null ? new LinkedHashMap<>() : new LinkedHashMap<>(mensaje.getVariables()))
                .estado(mensaje.getEstado())
                .error(mensaje.getError())
                .intentos(mensaje.getIntentos())
                .referencia(mensaje.getReferencia())
                .fechaCreacion(mensaje.getFechaCreacion())
                .fechaEnvio(mensaje.getFechaEnvio())
                .build();
    }
}
