package com.antojapp.notificaciones.config;

import com.antojapp.notificaciones.model.CanalNotificacion;
import com.antojapp.notificaciones.model.PlantillaNotificacion;
import com.antojapp.notificaciones.repository.PlantillaNotificacionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Plantillas de ejemplo para que el servicio funcione en el primer arranque.
// Los campos reemplazables usan la sintaxis de Thymeleaf: [[${variable}]]
@Component
public class DatosIniciales implements CommandLineRunner {
  private final PlantillaNotificacionRepository repo;

  public DatosIniciales(PlantillaNotificacionRepository repo) {
    this.repo = repo;
  }

  @Override
  public void run(String... args) {
    if (repo.count() > 0)
      return;

    guardar("BIENVENIDA", "Bienvenida al cliente", "Bienvenido a AntojApp",
        html("¡Hola, [[${cliente}]]!", "<p>Gracias por registrarte en AntojApp. Ya puedes pedir tu comida favorita.</p>"));

    guardar("PEDIDO_RECIBIDO", "Pedido recibido", "Pedido #[[${pedidoId}]] recibido en [[${restaurante}]]",
        html("¡Hola, [[${cliente}]]!", """
            <p>Recibimos tu pedido <strong>#[[${pedidoId}]]</strong> en <strong>[[${restaurante}]]</strong>.</p>
            <p style="margin:16px 0;font-size:22px;font-weight:800;color:#ff5a1f">$[[${total}]]</p>
            <p>Te avisaremos cuando el restaurante lo confirme.</p>
            """));

    guardar("PEDIDO_CONFIRMADO", "Pedido confirmado", "Tu pedido #[[${pedidoId}]] fue confirmado",
        html("¡Hola, [[${cliente}]]!", """
            <p>El restaurante <strong>[[${restaurante}]]</strong> confirmo tu pedido <strong>#[[${pedidoId}]]</strong>.</p>
            <p>Ya lo estan preparando.</p>
            """));

    guardar("PEDIDO_EN_CAMINO", "Pedido en camino", "Tu pedido #[[${pedidoId}]] va en camino",
        html("¡Hola, [[${cliente}]]!", """
            <p>Tu pedido <strong>#[[${pedidoId}]]</strong> de <strong>[[${restaurante}]]</strong> salio para tu direccion.</p>
            <p>Muy pronto lo tendras en tus manos.</p>
            """));

    guardar("PEDIDO_ENTREGADO", "Pedido entregado", "Tu pedido #[[${pedidoId}]] fue entregado",
        html("¡Hola, [[${cliente}]]!", """
            <p>Tu pedido <strong>#[[${pedidoId}]]</strong> de <strong>[[${restaurante}]]</strong> fue entregado.</p>
            <p style="margin:16px 0;font-size:22px;font-weight:800;color:#ff5a1f">$[[${total}]]</p>
            <p>¡Gracias por pedir con AntojApp!</p>
            """));

    guardar("PEDIDO_RECHAZADO", "Pedido rechazado", "Tu pedido #[[${pedidoId}]] no pudo ser aceptado",
        html("¡Hola, [[${cliente}]]!", """
            <p>El restaurante <strong>[[${restaurante}]]</strong> no pudo aceptar tu pedido <strong>#[[${pedidoId}]]</strong>.</p>
            <p style="margin:16px 0;padding:14px 16px;background:#fff1ea;border-radius:13px;color:#e9480f;font-weight:700;font-size:14px">Motivo: [[${motivo}]]</p>
            <p>Puedes intentar con otro restaurante desde AntojApp.</p>
            """));
  }

  private void guardar(String codigo, String nombre, String asunto, String cuerpo) {
    PlantillaNotificacion plantilla = PlantillaNotificacion.builder()
        .codigo(codigo)
        .nombre(nombre)
        .canal(CanalNotificacion.EMAIL)
        .asunto(asunto)
        .cuerpo(cuerpo)
        .activa(true)
        .build();
    repo.save(plantilla);
  }

  // Estilo minimalista acorde a la app: fondo crema #fffaf5, naranja #ff5a1f,
  // gradiente caracteristico y tipografia Plus Jakarta Sans.
  private String html(String titulo, String contenido) {
    return """
        <!DOCTYPE html>
        <html lang="es">
        <body style="margin:0;padding:0;background:#fffaf5;font-family:'Plus Jakarta Sans','DM Sans',system-ui,Arial,sans-serif;color:#1c1917">
          <div style="max-width:560px;margin:0 auto;padding:40px 24px">
            <div style="display:inline-grid;place-items:center;width:44px;height:44px;border-radius:13px;background:linear-gradient(135deg,#ff5a1f,#ff9a3d);box-shadow:0 6px 14px -6px #ff5a1f">
              <div style="width:16px;height:16px;background:#fff;border-radius:8px 8px 8px 1px"></div>
            </div>
            <h1 style="font-size:24px;font-weight:800;margin:20px 0 20px;letter-spacing:-.02em">%s</h1>
            <div style="font-size:15px;line-height:1.7;color:#44403c">%s</div>
            <div style="margin-top:32px;padding-top:20px;border-top:1px solid #efe7df">
              <span style="color:#78716c;font-size:13px;font-weight:700">AntojApp</span>
              <span style="display:block;color:#a8a29e;font-size:12px;margin-top:6px">Tu antojo, a un toque de distancia.</span>
            </div>
          </div>
        </body>
        </html>
        """.formatted(titulo, contenido);
  }
}
