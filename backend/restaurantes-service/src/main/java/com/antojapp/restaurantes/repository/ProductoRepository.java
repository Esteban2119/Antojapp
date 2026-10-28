package com.antojapp.restaurantes.repository;
import com.antojapp.restaurantes.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
// JpaRepository proporciona guardar, buscar, listar y eliminar
public interface ProductoRepository extends JpaRepository<Producto,Long> {}
