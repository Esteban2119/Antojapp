package com.antojapp.pedidos.repository;
import com.antojapp.pedidos.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PedidoRepository extends JpaRepository<Pedido,Long>{
 List<Pedido> findByEmailIgnoreCaseOrderByFechaDesc(String email);
 List<Pedido> findByRestauranteIdOrderByFechaDesc(Long restauranteId);
}
