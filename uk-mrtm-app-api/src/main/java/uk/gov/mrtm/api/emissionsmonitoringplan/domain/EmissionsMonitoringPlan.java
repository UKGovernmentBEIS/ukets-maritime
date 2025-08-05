package uk.gov.mrtm.api.emissionsmonitoringplan.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities.EmpControlActivities;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps.EmpDataGaps;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.monitoringreenhousegas.EmpMonitoringGreenhouseGas;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpManagementProcedures;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmissionsMonitoringPlan {

    @Valid
    @NotNull
    private EmpAbbreviations abbreviations;

    @Valid
    @NotNull
    private AdditionalDocuments additionalDocuments;

    @Valid
    @NotNull
    private EmpControlActivities controlActivities;

    @Valid
    @NotNull
    private EmpOperatorDetails operatorDetails;

    @Valid
    @NotNull
    private EmpManagementProcedures managementProcedures;

    @Valid
    @NotNull
    private EmpDataGaps dataGaps;

    @Valid
    @NotNull
    private EmpEmissions emissions;

    @Valid
    @NotNull
    private EmpEmissionSources sources;

    @Valid
    @NotNull
    private EmpMonitoringGreenhouseGas greenhouseGas;

    @JsonIgnore
    public Set<UUID> getEmpSectionAttachmentIds() {
        Set<UUID> attachments = new HashSet<>();
        if (additionalDocuments != null && !ObjectUtils.isEmpty(additionalDocuments.getDocuments())) {
            attachments.addAll(additionalDocuments.getDocuments());
        }   
        if (operatorDetails != null && !ObjectUtils.isEmpty(operatorDetails.getAttachmentIds())) {
            attachments.addAll(operatorDetails.getAttachmentIds());
        }
        if (managementProcedures != null) {
            attachments.addAll(managementProcedures.getAttachmentIds());
        }
        if (emissions != null && !ObjectUtils.isEmpty(emissions.getAttachmentIds())) {
            attachments.addAll(emissions.getAttachmentIds());
        }
        return Collections.unmodifiableSet(attachments);
    }
}
