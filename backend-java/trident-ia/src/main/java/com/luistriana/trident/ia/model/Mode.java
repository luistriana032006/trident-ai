package com.luistriana.trident.ia.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Mode {
    LOCAL,
    ENTITY,
    SEARCH;

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }
}
