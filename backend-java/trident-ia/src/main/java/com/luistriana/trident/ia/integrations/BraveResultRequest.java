package com.luistriana.trident.ia.integrations;

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
