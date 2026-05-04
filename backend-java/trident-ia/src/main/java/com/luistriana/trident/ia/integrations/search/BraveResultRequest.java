package com.luistriana.trident.ia.integrations.search;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BraveResultRequest {

   private List<SearchResult> results;

}
