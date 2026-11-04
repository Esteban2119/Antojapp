package com.antojapp.notificaciones.service;

import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.StringTemplateResolver;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Renderiza las plantillas guardadas en la base de datos con Thymeleaf.
 * Thymeleaf es la libreria de plantillas mantenida por el equipo de Thymeleaf
 * y usada por Spring Boot; permite reemplazar variables, aplicar condicionales
 * y escapar HTML automaticamente en el cuerpo del correo.
 *
 * Sintaxis de los campos reemplazables: [[${nombreVariable}]]
 */
@Component
public class RenderizadorPlantillas {
 private final SpringTemplateEngine motorHtml;
 private final SpringTemplateEngine motorTexto;

 public RenderizadorPlantillas(){
  this.motorHtml=crearMotor(TemplateMode.HTML);
  this.motorTexto=crearMotor(TemplateMode.TEXT);
 }

 private SpringTemplateEngine crearMotor(TemplateMode modo){
  StringTemplateResolver resolver=new StringTemplateResolver();
  resolver.setTemplateMode(modo);
  resolver.setCacheable(false);
  SpringTemplateEngine motor=new SpringTemplateEngine();
  motor.setTemplateResolver(resolver);
  return motor;
 }

 public String renderizarHtml(String plantilla,Map<String,String> variables){
  if(plantilla==null)return null;
  return motorHtml.process(plantilla,contexto(variables));
 }

 public String renderizarTexto(String plantilla,Map<String,String> variables){
  if(plantilla==null)return null;
  return motorTexto.process(plantilla,contexto(variables));
 }

 private Context contexto(Map<String,String> variables){
  Map<String,Object> datos=new HashMap<>();
  if(variables!=null)variables.forEach(datos::put);
  return new Context(Locale.getDefault(),datos);
 }
}
