package com.luistriana.trident.ia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient pythoClient() {

        return WebClient.builder().baseUrl("http://localhost:8000").build();

    }
}
