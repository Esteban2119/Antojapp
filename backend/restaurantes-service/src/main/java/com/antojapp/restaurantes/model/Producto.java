package com.antojapp.restaurantes.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
// Cada producto pertenece a un restaurante
@Entity public class Producto {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 public String nombre; public String descripcion; public BigDecimal precio; public String imagen;
 public Integer descuento=0; // porcentaje 0-100
 public Boolean disponible=true;
 @ManyToOne(optional=false) public Restaurante restaurante;
 public Producto() {}
 public Producto(String nombre,String descripcion,BigDecimal precio,String imagen,Restaurante restaurante){this.nombre=nombre;this.descripcion=descripcion;this.precio=precio;this.imagen=imagen;this.restaurante=restaurante;}
 // Filas creadas antes de agregar las columnas quedan en null
 @PostLoad void normalizar(){if(descuento==null)descuento=0;if(disponible==null)disponible=true;}
}
