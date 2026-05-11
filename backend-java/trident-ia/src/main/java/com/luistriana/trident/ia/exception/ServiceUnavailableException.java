package com.luistriana.trident.ia.exception;

public class ServiceUnavailableException extends RuntimeException {

    private final String source;

    public ServiceUnavailableException(String source, String message) {
        super(message);
        this.source = source;
    }

    public String getSource() {
        return source;
    }
}
