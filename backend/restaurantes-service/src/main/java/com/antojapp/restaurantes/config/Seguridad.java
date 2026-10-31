package com.antojapp.restaurantes.config;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
@Configuration public class Seguridad {
 // Las contrasenas se guardan cifradas con BCrypt, nunca en texto plano
 @Bean BCryptPasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
}
