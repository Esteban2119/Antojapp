package com.antojapp.pedidos.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
// Pedido persistido independientemente del catalogo
@Entity public class Pedido {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 public String cliente; public String direccion; public String estado="RECIBIDO";
 public String email; public String telefono; public String referencia;
 public Double latitud; public Double longitud;
 public Long restauranteId; public String restauranteNombre; public String motivoRechazo;
 // Pago: EFECTIVO (pagaCon para calcular el vuelto) o TRANSFERENCIA (cuentaPago PICHINCHA/DEUNA + comprobante)
 public String metodoPago; public BigDecimal pagaCon; public String cuentaPago; public String comprobante;
 // Facturacion: cedula/RUC del cliente; vacio = consumidor final
 public String identificacion; public String razonSocial;
 public BigDecimal total; public LocalDateTime fecha=LocalDateTime.now();
 @Column(length=4000) public String detalle; // JSON de productos: prototipo academico
 public Pedido(){}
}
