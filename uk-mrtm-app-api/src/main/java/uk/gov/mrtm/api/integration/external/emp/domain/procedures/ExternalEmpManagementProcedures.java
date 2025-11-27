package uk.gov.mrtm.api.integration.external.emp.domain.procedures;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpMonitoringReportingRole;

import java.util.ArrayList;
import java.util.List;


@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalEmpManagementProcedures {

    @Schema(description = "Monitoring and reporting roles")
    @Valid
    @NotEmpty
    @Builder.Default
    private List<EmpMonitoringReportingRole> monitoringReportingRoles = new ArrayList<>();

    @Schema(description = "Regular check of the adequacy of the monitoring plan")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm adequacyCheckProcedure;

    @Schema(description = "Procedures for data flow activities")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm dataFlowActivitiesProcedure;

    @Schema(description = "Procedures for risk assessment")
    @Valid
    @NotNull
    private ExternalEmpProcedureForm riskAssessmentProcedure;

}
