package com.perfumeshop.common.config;

import org.springframework.boot.context.event.ApplicationContextInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class LiquibaseConfig implements ApplicationListener<ApplicationContextInitializedEvent> {

    @Override
    public void onApplicationEvent(ApplicationContextInitializedEvent event) {
        // Disable secure parsing to allow XSD lookups
        System.setProperty("liquibase.secureParsing", "false");
    }
}
