package com.aineurysm;

import com.aineurysm.model.User;
import com.aineurysm.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AiNeurysmApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiNeurysmApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Crear usuario administrador por defecto si no existe
			if (!userRepository.existsByEmail("admin@aneurysm.com")) {
				User admin = new User();
				admin.setEmail("admin@aneurysm.com");
				admin.setPassword(passwordEncoder.encode("123456"));
				admin.setName("Administrador");
				admin.setRole("admin");
				admin.setIsActive(true);
				admin.setIsApproved(true);
				userRepository.save(admin);
				System.out.println("Usuario administrador creado: admin@aneurysm.com / 123456");
			}
		};
	}
}