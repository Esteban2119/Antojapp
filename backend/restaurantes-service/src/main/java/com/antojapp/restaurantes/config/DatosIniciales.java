package com.antojapp.restaurantes.config;
import com.antojapp.restaurantes.model.*;
import com.antojapp.restaurantes.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import java.math.BigDecimal;
import java.util.Map;
@Configuration public class DatosIniciales {
 // Imagenes servidas por el frontend (carpeta frontend/public/img)
 private static final Map<String,String> LOGOS=Map.of("La Ruta Burger","/img/restaurantes/la-ruta-burger.png","KFC","/img/restaurantes/kfc.png");
 private static final Map<String,String> FOTOS=Map.of(
  "Hornado","/img/productos/hornado.png","Llapingachos","/img/productos/llapingachos.png",
  "Hamburguesa clásica","/img/productos/hamburguesa-clasica.png","Papas especiales","/img/productos/papas-especiales.png",
  "Ceviche de camarón","/img/productos/ceviche-camaron.png","Encocado","/img/productos/encocado.png");
 @Bean CommandLineRunner cargar(RestauranteRepository rr,ProductoRepository pr){return args->{
  // Inserta datos de demostracion solo si la base esta vacia
  if(rr.count()==0){
   Restaurante a=rr.save(new Restaurante("Sabor de Casa","Comida tradicional ecuatoriana","","Ecuatoriana"));
   Restaurante b=rr.save(new Restaurante("La Ruta Burger","Hamburguesas y antojos","","Rápida"));
   Restaurante c=rr.save(new Restaurante("Costa Fresca","Sabores de la costa","","Mariscos"));
   pr.save(new Producto("Hornado","Cerdo horneado con mote y ensalada",new BigDecimal("6.50"),"",a));
   pr.save(new Producto("Llapingachos","Tortillas de papa con chorizo",new BigDecimal("4.75"),"",a));
   Producto burger=new Producto("Hamburguesa clásica","Carne, queso y vegetales",new BigDecimal("5.25"),"",b);burger.descuento=15;pr.save(burger);
   pr.save(new Producto("Papas especiales","Papas crocantes con salsa",new BigDecimal("3.00"),"",b));
   pr.save(new Producto("Ceviche de camarón","Ceviche fresco estilo ecuatoriano",new BigDecimal("7.50"),"",c));
   pr.save(new Producto("Encocado","Pescado en salsa de coco",new BigDecimal("8.00"),"",c));
  }
  if(rr.findFirstByNombreIgnoreCase("KFC").isEmpty()){
   Restaurante k=rr.save(new Restaurante("KFC","Pollo frito con la receta secreta del Coronel","","Rápida"));
   Producto bucket=new Producto("Bucket 8 presas","8 presas de pollo crujiente, papas familiares y gaseosa",new BigDecimal("16.99"),"",k);bucket.descuento=10;pr.save(bucket);
   pr.save(new Producto("Alitas picantes","6 alitas con salsa picante y papas",new BigDecimal("6.75"),"",k));
   pr.save(new Producto("Sánduche crispy","Filete de pollo crujiente, lechuga y mayonesa",new BigDecimal("5.50"),"",k));
  }
  // Completa imagenes que esten vacias sin sobrescribir las que el restaurante haya cambiado
  rr.findAll().stream().filter(r->vacio(r.imagen)&&LOGOS.containsKey(r.nombre)).forEach(r->{r.imagen=LOGOS.get(r.nombre);rr.save(r);});
  pr.findAll().stream().filter(p->vacio(p.imagen)&&FOTOS.containsKey(p.nombre)).forEach(p->{p.imagen=FOTOS.get(p.nombre);pr.save(p);});
 };}
 private static boolean vacio(String s){return s==null||s.isBlank();}
}
