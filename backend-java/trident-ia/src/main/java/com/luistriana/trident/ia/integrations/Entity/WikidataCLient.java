package com.luistriana.trident.ia.integrations.Entity;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Component
public class WikidataCLient {

    private final WebClient webClient = WebClient.create("https://www.wikidata.org");

    private final WebClient sparqlClient = WebClient.create("https://query.wikidata.org");

    public Mono<WikiDataEntityResult> search(String query) {

        return webClient.get()
                .uri(uribilder -> uribilder.path("/w/api.php")
                        .queryParam("action", "wbsearchentities")
                        .queryParam("search", query)
                        .queryParam("language", "es")
                        .queryParam("format", "json")
                        .queryParam("limit", 1)
                        .build())
                .retrieve()
                .bodyToMono(WikiDataSearchResponse.class)
                .flatMap(wikidataResponse -> {
                    String id = wikidataResponse.getSearch().get(0).getId();

                    String sparqlQuery = """
                            SELECT ?nombreCompleto ?fechaDeNacimiento ?fechaDeMuerte ?ocupacion ?pais WHERE
                            {
                            wd:%s rdfs:label ?nombreCompleto. FILTER(LANG(?nombreCompleto)= "es").
                            OPTIONAL { wd:%s wdt:P569 ?fechaDeNacimiento. }
                            OPTIONAL { wd:%s wdt:P570 ?fechaDeMuerte. }
                            OPTIONAL { wd:%s wdt:P106 ?ocupacion. }
                            OPTIONAL { wd:%s wdt:P27 ?pais. }
                            }""".formatted(id, id, id, id, id);
                    URI sparqlUri = URI.create("https://query.wikidata.org/sparql?query="
                            + URLEncoder.encode(sparqlQuery, StandardCharsets.UTF_8)
                            + "&format=json");

                    return sparqlClient.get()
                            .uri(sparqlUri)
                            .retrieve()
                            .bodyToMono(WikidataSparqlResponse.class)
                            .map(sparqlResponse -> sparqlResponse.getResults().getBindings().get(0));

                });

    }
}
