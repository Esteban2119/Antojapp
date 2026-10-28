package com.antojapp.pedidos.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
// Pedido persistido independientemente del catalogo
@Entity public class Pedido {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 public String cliente; public String direccion; public String estado="RECIBIDO";
 public BigDecimal total; public LocalDateTime fecha=LocalDateTime.now();
 @Column(length=4000) public String detalle; // JSON de productos: prototipo academico
 public Pedido(){}
}
