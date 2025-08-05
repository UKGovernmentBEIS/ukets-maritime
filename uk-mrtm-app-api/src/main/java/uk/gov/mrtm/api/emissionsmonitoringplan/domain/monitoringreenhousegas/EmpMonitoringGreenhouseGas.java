package uk.gov.mrtm.api.emissionsmonitoringplan.domain.monitoringreenhousegas;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionMonitoringPlanSection;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpMonitoringGreenhouseGas implements EmissionMonitoringPlanSection {

    @Valid
    @NotNull
    private EmpProcedureForm fuel;

    @Valid
    @NotNull
    private EmpProcedureForm crossChecks;

    @Valid
    @NotNull
    private EmpProcedureForm information;

    @Valid
    @NotNull
    private EmpProcedureForm qaEquipment;

    @Valid
    @NotNull
    private EmpProcedureForm voyages;
}
