package com.antojapp.restaurantes.repository;
import com.antojapp.restaurantes.model.Restaurante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
// JpaRepository proporciona guardar, buscar, listar y eliminar
public interface RestauranteRepository extends JpaRepository<Restaurante,Long> {
 Optional<Restaurante> findFirstByNombreIgnoreCase(String nombre);
}
