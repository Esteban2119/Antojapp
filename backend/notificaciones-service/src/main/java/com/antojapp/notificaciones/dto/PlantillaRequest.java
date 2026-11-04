package com.antojapp.notificaciones.dto;

import com.antojapp.notificaciones.model.CanalNotificacion;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder.Default;

// Datos para crear o actualizar una plantilla de notificacion
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantillaRequest {

    @NotBlank(message = "codigo es obligatorio")
    private String codigo;

    @NotBlank(message = "nombre es obligatorio")
    private String nombre;

    @Default 
    private CanalNotificacion canal = CanalNotificacion.EMAIL;

    private String asunto;

    @NotBlank(message = "cuerpo es obligatorio")
    private String cuerpo;

    @Default 
    private Boolean activa = true;
}
