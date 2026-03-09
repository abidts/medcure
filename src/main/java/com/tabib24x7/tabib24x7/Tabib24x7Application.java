package com.tabib24x7.tabib24x7;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.tabib24x7"})
@EnableJpaRepositories(basePackages = {"com.tabib24x7.repository"})
@EntityScan(basePackages = {"com.tabib24x7.model"})
public class Tabib24x7Application {

	public static void main(String[] args) {
		SpringApplication.run(Tabib24x7Application.class, args);
	}

}
