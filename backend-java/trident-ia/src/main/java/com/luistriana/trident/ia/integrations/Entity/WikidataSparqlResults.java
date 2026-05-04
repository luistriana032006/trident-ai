package com.luistriana.trident.ia.integrations.Entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WikidataSparqlResults {

    private List<WikiDataEntityResult> bindings;

}
