package com.luistriana.trident.ia.model;

import lombok.AllArgsConstructor;
import lombok.Value;

@Value
@AllArgsConstructor
public class ErrorResponse {
private String source;
private String typeError;
private int statusCode;
}
