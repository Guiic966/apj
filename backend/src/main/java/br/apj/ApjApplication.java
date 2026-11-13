package br.apj;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class ApjApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApjApplication.class, args);
    }
    
    @Bean
    CommandLineRunner seed(UserRepository repo) {
        return args -> {
            if (repo.findByEmail("teste@apj.com").isEmpty()) {
                repo.save(new User("Marina", "teste@apj.com",
                        new BCryptPasswordEncoder().encode("12345678")));
            }
        };
    }
}
