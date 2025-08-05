package uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpAbbreviationDefinition {

    @NotBlank
    @Size(max=30)
    private String abbreviation;

    @NotBlank
    @Size(max=255)
    private String definition;
}
