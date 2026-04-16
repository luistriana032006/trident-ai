package com.luistriana.trident.ia.service;

import org.springframework.stereotype.Service;

import com.luistriana.trident.ia.integrations.PythonClient;
import com.luistriana.trident.ia.integrations.PythonRequest;
import com.luistriana.trident.ia.model.ChatRequest;
import com.luistriana.trident.ia.model.ChatResponse;
import com.luistriana.trident.ia.model.Mode;


import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service

@RequiredArgsConstructor

public class ChatService {

    private final PythonClient pythonClient;

    public Mono<ChatResponse> sendLocal(ChatRequest request) {
        PythonRequest pythonRequest = new PythonRequest(Mode.LOCAL, request.getPrompt());
        return pythonClient.sendChat(pythonRequest);
    }

    public Mono<ChatResponse> sendEntity(ChatRequest request) {
        PythonRequest pythonRequest = new PythonRequest(Mode.ENTITY, request.getPrompt());
        return pythonClient.sendChat(pythonRequest);
    }

    public Mono<ChatResponse> sendSearch(ChatRequest request) {
        PythonRequest pythonRequest = new PythonRequest(Mode.SEARCH, request.getPrompt());
        return pythonClient.sendChat(pythonRequest);
    }

}
