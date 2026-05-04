package com.luistriana.trident.ia.integrations.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {

    private String url;
    private String title;
    private String description;


}
