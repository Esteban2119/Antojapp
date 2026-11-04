package com.antojapp.notificaciones.service;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class RenderizadorPlantillasTest {
 private final RenderizadorPlantillas renderizador=new RenderizadorPlantillas();

 @Test void reemplazaVariablesEnTexto(){
  String resultado=renderizador.renderizarTexto(
   "Hola [[${cliente}]], tu pedido [[${pedidoId}]] cuesta $[[${total}]]",
   Map.of("cliente","Ana","pedidoId","42","total","12.50"));
  assertEquals("Hola Ana, tu pedido 42 cuesta $12.50",resultado);
 }

 @Test void reemplazaYEscapaVariablesEnHtml(){
  String resultado=renderizador.renderizarHtml(
   "<p>Hola [[${cliente}]]</p>",
   Map.of("cliente","<script>alert(1)</script>"));
  assertFalse(resultado.contains("<script>"));
  assertTrue(resultado.contains("&lt;script&gt;"));
 }
}
