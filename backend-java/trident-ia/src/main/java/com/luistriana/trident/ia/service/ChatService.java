package com.luistriana.trident.ia.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.luistriana.trident.ia.integrations.PythonClient;
import com.luistriana.trident.ia.integrations.PythonRequest;
import com.luistriana.trident.ia.integrations.Entity.WikiDataEntityResult;
import com.luistriana.trident.ia.integrations.Entity.WikidataCLient;
import com.luistriana.trident.ia.integrations.search.BraveSearchClient;
import com.luistriana.trident.ia.integrations.search.SearchResult;
import com.luistriana.trident.ia.model.ChatRequest;
import com.luistriana.trident.ia.model.ChatResponse;
import com.luistriana.trident.ia.model.Mode;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service

@RequiredArgsConstructor

public class ChatService {

    private final PythonClient pythonClient;
    private final BraveSearchClient braveClient;
    private final WikidataCLient wikiClient;
    
    public Mono<ChatResponse> sendLocal(ChatRequest request) {
        PythonRequest pythonRequest = new PythonRequest(Mode.LOCAL, request.getPrompt());
        return pythonClient.sendChat(pythonRequest);
    }

    public Mono<ChatResponse> sendEntity(ChatRequest request) {
       // PythonRequest pythonRequest = new PythonRequest(Mode.ENTITY, request.getPrompt());
        // return pythonClient.sendChat(pythonRequest);
       return wikiClient.search(request.getPrompt())
        .flatMap(entity -> {
            String context = "nombre: "+entity.getNombreCompleto().getValue() + "\n" +
            "nacimiento: " + entity.getFechaDeNacimiento().getValue() +"\n" +
            "muerte: " + entity.getFechaDeMuerte().getValue() + "\n" +
            "pais: " + entity.getPais().getValue() + "\n" + 
            "ocupacion: " + entity.getOcupacion().getValue(); 
            

              String enrichedPrompt = "Usa esta información:\n" + context + "\n\nPregunta: "+request.getPrompt();
              PythonRequest pythonRequest = new PythonRequest(Mode.ENTITY, enrichedPrompt);
              return pythonClient.sendChat(pythonRequest);
            });

    }

    public Mono<ChatResponse> sendSearch(ChatRequest request) {
        // PythonRequest pythonRequest = new PythonRequest(Mode.SEARCH,
        // request.getPrompt());
        // return pythonClient.sendChat(pythonRequest);

        return braveClient.search(request.getPrompt())
                .flatMap(braveResponse -> {
                    List<SearchResult> results = braveResponse.getWeb().getResults();
                    String context = results.stream()
                            .map(r -> "Título: " + r.getTitle() + "\nDescripción: " + r.getDescription())
                            .collect(Collectors.joining("\n\n"));

                    String enrichedPrompt = "Usa esta información:\n" + context + "\n\nPregunta: "
                            + request.getPrompt();
                    PythonRequest pythonRequest = new PythonRequest(Mode.SEARCH, enrichedPrompt);
                    return pythonClient.sendChat(pythonRequest);

                });
    }

}
