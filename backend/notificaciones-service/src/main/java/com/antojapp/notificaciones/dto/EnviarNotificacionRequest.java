package com.antojapp.notificaciones.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder.Default;

import java.util.LinkedHashMap;
import java.util.Map;

// Datos necesarios para renderizar un template y enviarlo por su canal.
// Las variables son texto porque solo se usan para reemplazar campos.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnviarNotificacionRequest {

    @NotBlank(message = "codigoPlantilla es obligatorio")
    private String codigoPlantilla;

    @NotBlank(message = "destinatario es obligatorio")
    private String destinatario;

    @Default 
    private Map<String, String> variables = new LinkedHashMap<>();

    private String referencia;
}
