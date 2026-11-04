package com.antojapp.notificaciones.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

// Mensaje persistido antes de intentar el envio. Guarda una copia del asunto,
// el cuerpo ya renderizado y las variables originales para poder auditar o
// reenviar sin depender de que el template siga existiendo.
@Entity
@Table(name = "mensajes_notificacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MensajeNotificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CanalNotificacion canal;

    @Column(nullable = false, length = 320)
    private String destinatario;

    @Column(length = 255)
    private String asunto;

    @Column(columnDefinition = "TEXT")
    private String cuerpo;

    @Column(length = 80)
    private String codigoPlantilla;

    // Esquema variable: cada envio trae las variables que necesite, por eso
    // se usa jsonb con un Map y no una clase fija.
    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    @Builder.Default
    private Map<String, String> variables = new LinkedHashMap<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoNotificacion estado = EstadoNotificacion.PENDIENTE;

    @Column(length = 1000)
    private String error;

    @Column(nullable = false)
    @Builder.Default
    private int intentos = 0;

    // Identificador externo de lo que motivo la notificacion.
    @Column(length = 120)
    private String referencia;

    // UUID de la solicitud recibida por Kafka que origino el mensaje. La
    // restriccion unique hace que una reentrega del mismo mensaje no genere
    // una notificacion duplicada.
    @Column(length = 36, unique = true)
    private String solicitudId;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    private LocalDateTime fechaEnvio;
}
