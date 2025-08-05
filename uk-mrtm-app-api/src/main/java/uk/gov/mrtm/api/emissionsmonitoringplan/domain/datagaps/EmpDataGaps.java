package uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionMonitoringPlanSection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpDataGaps implements EmissionMonitoringPlanSection {
    
    @Size(max = 10000)
    private String formulaeUsed;

    @NotBlank
    @Size(max = 10000)
    private String fuelConsumptionEstimationMethod;

    @NotBlank
    @Size(max = 250)
    private String responsiblePersonOrPosition;

    @NotBlank
    @Size(max = 10000)
    private String dataSources;

    @NotBlank
    @Size(max = 250)
    private String recordsLocation;

    @Size(max = 250)
    private String itSystemUsed;
}
