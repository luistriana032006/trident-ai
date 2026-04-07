package com.luistriana.trident.ia.model;

import lombok.AllArgsConstructor;

import lombok.Value;

@Value
@AllArgsConstructor
public class ChatResponse {
private Mode mode;
private Model modelUsed;
private String response;


}
