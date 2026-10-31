package com.antojapp.restaurantes.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
// Cuenta de acceso: CLIENTE (compra) o LOCAL (administra un restaurante)
@Entity @Table(name="usuario") public class Usuario {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 public String nombre; @Column(unique=true,nullable=false) public String email; public String telefono;
 @JsonIgnore public String passwordHash;
 public String rol;
 @ManyToOne public Restaurante restaurante;
 public Usuario(){}
 public Usuario(String nombre,String email,String telefono,String passwordHash,String rol,Restaurante restaurante){this.nombre=nombre;this.email=email;this.telefono=telefono;this.passwordHash=passwordHash;this.rol=rol;this.restaurante=restaurante;}
}
