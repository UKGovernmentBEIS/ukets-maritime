package uk.gov.mrtm.api.integration.external.emp.domain.datagaps;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalEmpDataGaps {
    
    @Size(max = 10000)
    private String formulaeUsed;

    @NotBlank
    @Size(min = 1, max = 10000)
    private String fuelConsumptionEstimationMethod;

    @NotBlank
    @Size(min = 1, max = 250)
    private String responsiblePerson;

    @NotBlank
    @Size(min = 1, max = 10000)
    private String dataSources;

    @NotBlank
    @Size(min = 1, max = 250)
    private String locationOfRecords;

    @Size(max = 250)
    private String itSystem;
}
