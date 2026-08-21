package com.perfumeshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PerfumeShopApplication {

    public static void main(String[] args) {
        System.setProperty("liquibase.secureParsing", "false");
        SpringApplication.run(PerfumeShopApplication.class, args);
    }
}
