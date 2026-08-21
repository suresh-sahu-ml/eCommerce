package com.perfumeshop.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.DefaultPropertySourceFactory;
import org.springframework.core.io.support.EncodedResource;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class EnvPropertySourceFactory extends DefaultPropertySourceFactory {

    @Override
    public PropertySource<?> createPropertySource(String name, EncodedResource resource) throws IOException {
        Map<String, Object> properties = new HashMap<>();

        try {
            Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .directory("./")
                .load();

            dotenv.entries().forEach(entry -> {
                properties.put(entry.getKey(), entry.getValue());
                System.out.println("✓ Loaded from .env: " + entry.getKey() + "=" +
                    (entry.getKey().contains("KEY") || entry.getKey().contains("PASSWORD") ? "***" : entry.getValue()));
            });
        } catch (Exception e) {
            System.out.println("⚠ Could not load .env file: " + e.getMessage());
        }

        return new MapPropertySource("dotenv", properties);
    }
}
