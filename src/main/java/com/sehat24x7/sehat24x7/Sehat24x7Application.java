package com.sehat24x7.sehat24x7;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.sehat24x7"})
@EnableJpaRepositories(basePackages = {"com.sehat24x7.repository"})
@EntityScan(basePackages = {"com.sehat24x7.model"})
public class Sehat24x7Application {

	public static void main(String[] args) {
		SpringApplication.run(Sehat24x7Application.class, args);
	}

}
