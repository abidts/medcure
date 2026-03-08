package com.medcurekashmir.medcurekashmir;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.medcurekashmir"})
@EnableJpaRepositories(basePackages = {"com.medcurekashmir.repository"})
@EntityScan(basePackages = {"com.medcurekashmir.model"})
public class MedcurekashmirApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedcurekashmirApplication.class, args);
	}

}
