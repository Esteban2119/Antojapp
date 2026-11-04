package com.antojapp.notificaciones.config;

import com.antojapp.notificaciones.exception.RecursoNoEncontradoException;
import com.antojapp.notificaciones.exception.SolicitudInvalidaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.DeserializationException;
import org.springframework.util.backoff.FixedBackOff;

import org.apache.kafka.clients.admin.NewTopic;

/**
 * Topics y manejo de errores del consumer.
 *
 * Flujo ante un fallo: DefaultErrorHandler espera y reintenta; si se agotan
 * los intentos publica el registro original en <topic>-dlt y continua con el
 * siguiente mensaje. Asi un evento invalido no bloquea la particion.
 */
@Configuration
public class KafkaConfig {

  private static final Logger log = LoggerFactory.getLogger(KafkaConfig.class);

  @Bean
  public NewTopic topicSolicitudesNotificacion(
      @Value("${notificaciones.kafka.topic-solicitudes:notificaciones-solicitadas}") String topic,
      @Value("${notificaciones.kafka.particiones:3}") int particiones,
      @Value("${notificaciones.kafka.replicas:1}") short replicas) {
    return TopicBuilder.name(topic).partitions(particiones).replicas(replicas).build();
  }

  @Bean
  public NewTopic topicSolicitudesNotificacionDlt(
      @Value("${notificaciones.kafka.topic-solicitudes:notificaciones-solicitadas}") String topic,
      @Value("${notificaciones.kafka.particiones:3}") int particiones,
      @Value("${notificaciones.kafka.replicas:1}") short replicas) {
    // Debe tener al menos las mismas particiones que el topic original.
    return TopicBuilder.name(topic + "-dlt").partitions(particiones).replicas(replicas).build();
  }

  /**
   * Spring Boot detecta este bean y lo aplica al listener container factory
   * que crea automaticamente para @KafkaListener.
   */
  @Bean
  public DefaultErrorHandler errorHandler(
      KafkaTemplate<Object, Object> kafkaTemplate,
      @Value("${notificaciones.kafka.reintentos:3}") long reintentos,
      @Value("${notificaciones.kafka.espera-ms:2000}") long esperaMs) {

    DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(kafkaTemplate);
    DefaultErrorHandler handler = new DefaultErrorHandler(recoverer, new FixedBackOff(esperaMs, reintentos));

    // Estos errores no se arreglan reintentando: van directo al DLT.
    handler.addNotRetryableExceptions(
        DeserializationException.class,
        SolicitudInvalidaException.class,
        RecursoNoEncontradoException.class,
        IllegalArgumentException.class);

    handler.setRetryListeners((record, ex, intento) -> log.warn(
        "Fallo al procesar {}-{}-{} (intento {}): {}",
        record.topic(), record.partition(), record.offset(), intento, ex.getMessage()));

    return handler;
  }
}
