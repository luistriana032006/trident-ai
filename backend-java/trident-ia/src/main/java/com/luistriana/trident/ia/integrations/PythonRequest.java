package com.luistriana.trident.ia.integrations;

import com.luistriana.trident.ia.model.Mode;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PythonRequest {

    private Mode mode;
    private String prompt;

}
