package uk.gov.mrtm.api.integration.external.emp.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities.EmpControlActivities;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps.EmpDataGaps;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpManagementProcedures;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate.EmpMandate;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.monitoringreenhousegas.EmpMonitoringGreenhouseGas;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StagingEmissionsMonitoringPlan extends ThirdPartyDataProviderPayload {

    @Valid
    @NotNull
    private EmpEmissions emissions;

    @Valid
    @NotNull
    private EmpMandate mandate;

    @Valid
    @NotNull
    private EmpEmissionSources sources;

    @Valid
    @NotNull
    private EmpMonitoringGreenhouseGas greenhouseGas;

    @Valid
    @NotNull
    private EmpManagementProcedures managementProcedures;

    @Valid
    @NotNull
    private EmpControlActivities controlActivities;

    @Valid
    @NotNull
    private EmpDataGaps dataGaps;
}