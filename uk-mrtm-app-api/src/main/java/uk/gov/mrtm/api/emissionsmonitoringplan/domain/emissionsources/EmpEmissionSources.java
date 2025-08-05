package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionMonitoringPlanSection;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmpEmissionSources implements EmissionMonitoringPlanSection {

    @Valid
    @NotNull
    private EmpProcedureForm listCompletion;

    @Valid
    @NotNull
    private EmpEmissionFactors emissionFactors;
    
    @Valid
    private EmpEmissionCompliance emissionCompliance;
}
