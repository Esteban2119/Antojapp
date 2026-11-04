package com.antojapp.notificaciones.service;

import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.model.MensajeNotificacion;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

/**
 * Implementacion de correo electronico. Usa JavaMailSender de Spring Boot y
 * el SMTP configurado en application.properties. En local apunta a Mailpit
 * (localhost:1025), por lo que los correos se ven en http://localhost:8025.
 */
@Component
public class EmailNotificacionSender implements NotificacionSender {
  private final JavaMailSender mailSender;
  private final String remitente;

  public EmailNotificacionSender(JavaMailSender mailSender,
      @Value("${notificaciones.remitente:AntojApp <no-reply@antojapp.local>}") String remitente) {
    this.mailSender = mailSender;
    this.remitente = remitente;
  }

  @Override
  public CanalNotificacion canal() {
    return CanalNotificacion.EMAIL;
  }

  @Override
  public void enviar(MensajeNotificacion mensaje) {
    try {
      MimeMessage mime = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(mime, false, StandardCharsets.UTF_8.name());
      helper.setFrom(remitente);
      helper.setTo(mensaje.getDestinatario());
      helper.setSubject(mensaje.getAsunto() == null ? "" : mensaje.getAsunto());
      helper.setText(mensaje.getCuerpo() == null ? "" : mensaje.getCuerpo(), true); // true = HTML
      mailSender.send(mime);
    } catch (MessagingException | MailException e) {
      throw new IllegalStateException("No se pudo enviar el correo: " + e.getMessage(), e);
    }
  }
}
