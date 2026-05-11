package com.luistriana.trident.ia.exception;

public class ServiceErrorException extends RuntimeException {

    private final String source;

    public ServiceErrorException(String source, String message) {
        super(message);
        this.source = source;
    }

    public String getSource() {
        return source;
    }
}
