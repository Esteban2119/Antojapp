package com.antojapp.restaurantes.model;
import jakarta.persistence.*;
// Tabla de restaurantes en PostgreSQL
@Entity public class Restaurante {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 public String nombre; public String descripcion; public String imagen; public String categoria;
 public Restaurante() {}
 public Restaurante(String nombre,String descripcion,String imagen,String categoria){this.nombre=nombre;this.descripcion=descripcion;this.imagen=imagen;this.categoria=categoria;}
}
