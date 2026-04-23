package com.luistriana.trident.ia.integrations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;


@Component
public class BraveSearchClient {
    @Value("${brave.api.key}")
    private String apikey;

    private final WebClient webClient = WebClient.create("https://api.search.brave.com");

    public Mono<BraveWebRequest> search(@lombok.NonNull String query){
       return webClient.get()
        .uri(uriBuilder -> uriBuilder.path("/res/v1/web/search")
        .queryParam("q", query).build())
        .header("Accept", "application/json")
        .header("Accept-Encoding", "gzip")
        .header("X-Subscription-Token", apikey)
        .retrieve()
        .bodyToMono(BraveWebRequest.class);

    }
}
