package com.antojapp.restaurantes.config;
import com.antojapp.restaurantes.model.*;
import com.antojapp.restaurantes.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import java.math.BigDecimal;
@Configuration public class DatosIniciales {
 // Inserta datos de demostracion solo si la base esta vacia
 @Bean CommandLineRunner cargar(RestauranteRepository rr,ProductoRepository pr){return args->{
 if(rr.count()>0)return;
 Restaurante a=rr.save(new Restaurante("Sabor de Casa","Comida tradicional ecuatoriana","","Ecuatoriana"));
 Restaurante b=rr.save(new Restaurante("La Ruta Burger","Hamburguesas y antojos","","Rápida"));
 Restaurante c=rr.save(new Restaurante("Costa Fresca","Sabores de la costa","","Mariscos"));
 pr.save(new Producto("Hornado","Cerdo horneado con mote y ensalada",new BigDecimal("6.50"),"",a));
 pr.save(new Producto("Llapingachos","Tortillas de papa con chorizo",new BigDecimal("4.75"),"",a));
 pr.save(new Producto("Hamburguesa clásica","Carne, queso y vegetales",new BigDecimal("5.25"),"",b));
 pr.save(new Producto("Papas especiales","Papas crocantes con salsa",new BigDecimal("3.00"),"",b));
 pr.save(new Producto("Ceviche de camarón","Ceviche fresco estilo ecuatoriano",new BigDecimal("7.50"),"",c));
 pr.save(new Producto("Encocado","Pescado en salsa de coco",new BigDecimal("8.00"),"",c));
 };}
}
