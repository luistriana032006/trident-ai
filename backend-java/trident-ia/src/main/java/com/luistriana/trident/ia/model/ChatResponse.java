package com.luistriana.trident.ia.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Value;

@Value
@AllArgsConstructor
public class ChatResponse {
    private String mode;
    @JsonProperty("model_used")
    private String modelUsed;
    private String response;
}
