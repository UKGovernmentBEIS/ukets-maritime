package uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionMonitoringPlanSection;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureFormWithFiles;

import java.util.List;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.Collections;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpManagementProcedures implements EmissionMonitoringPlanSection {

    @Valid
    @NotEmpty
    @Builder.Default
    private List<EmpMonitoringReportingRole> monitoringReportingRoles = new ArrayList<>();

    @Valid
    @NotNull
    private EmpProcedureForm regularCheckOfAdequacy;

    @Valid
    @NotNull
    private EmpProcedureFormWithFiles dataFlowActivities;

    @Valid
    @NotNull
    private EmpProcedureFormWithFiles riskAssessmentProcedures;

    @JsonIgnore
    public Set<UUID> getAttachmentIds() {
        Set<UUID> attachments = new HashSet<>();
        if (dataFlowActivities != null && dataFlowActivities.getFiles() != null) {
            attachments.addAll(dataFlowActivities.getFiles());
        }
        if (riskAssessmentProcedures != null && riskAssessmentProcedures.getFiles() != null) {
            attachments.addAll(riskAssessmentProcedures.getFiles());
        }
        return Collections.unmodifiableSet(attachments);
    }
}
