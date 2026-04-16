package com.luistriana.trident.ia.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luistriana.trident.ia.model.ChatRequest;
import com.luistriana.trident.ia.model.ChatResponse;
import com.luistriana.trident.ia.service.ChatService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/local")
    public Mono<ChatResponse> chatLocal(@RequestBody ChatRequest request) {
        // TODO: process POST request

        return chatService.sendLocal(request);
    }


    @PostMapping("/entity")
    public Mono<ChatResponse> chatEntity(@RequestBody ChatRequest request) {
        return chatService.sendEntity(request);
    }

    @PostMapping("/search")
    public Mono<ChatResponse> chatSearch(@RequestBody ChatRequest request) {
        return chatService.sendSearch(request);
    }

}
