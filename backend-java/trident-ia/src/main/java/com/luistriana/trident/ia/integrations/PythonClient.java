package com.luistriana.trident.ia.integrations;

import org.springframework.web.reactive.function.client.WebClient;

import com.luistriana.trident.ia.model.ChatResponse;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PythonClient {
    private final WebClient webClient;

    public Mono<ChatResponse> sendChat(@lombok.NonNull PythonRequest request) {

        return webClient.post()
                .uri("/chat")
                .bodyValue(request)
                .retrieve().bodyToMono(ChatResponse.class);
    }

    // llamada a la url de la api key de brave
   
}
