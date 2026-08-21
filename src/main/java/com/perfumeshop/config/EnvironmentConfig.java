package com.perfumeshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = "file:.env", factory = EnvPropertySourceFactory.class, ignoreResourceNotFound = true)
public class EnvironmentConfig {

    public EnvironmentConfig() {
        System.out.println("\n✓ EnvironmentConfig initialized - .env properties loaded\n");
    }
}
