package uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueField;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalAerAggregatedDataShipEmissions {

    @NotBlank
    @Size(min = 1, max = 7)
    @UniqueField
    private String shipImoNumber;

    @NotNull
    @Valid
    private ExternalAerAggregatedDataAnnualEmission annualEmission;
}
