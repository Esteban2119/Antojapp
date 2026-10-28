package com.antojapp.pedidos.repository;
import com.antojapp.pedidos.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PedidoRepository extends JpaRepository<Pedido,Long>{}
