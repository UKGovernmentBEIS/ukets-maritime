package uk.gov.mrtm.api.reporting.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortEmissions;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissions;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aer {

    @Valid
    @NotNull
    private AerOperatorDetails operatorDetails;

    @Valid
    @NotNull
    private AdditionalDocuments additionalDocuments;

    @Valid
    @NotNull
    private AerEmissions emissions;

    @Valid
    @NotNull
    private AerMonitoringPlanChanges aerMonitoringPlanChanges;

    @Valid
    private AerPortEmissions portEmissions;

    @Valid
    private AerVoyageEmissions voyageEmissions;

    @Valid
    @NotNull
    private AerAggregatedData aggregatedData;

    @Valid
    @NotNull
    private AerSmf smf;

    @Valid
    @NotNull
    private AerTotalEmissions totalEmissions;

    @JsonIgnore
    public Set<UUID> getAerSectionAttachmentIds() {
        Set<UUID> attachments = new HashSet<>();

        if (additionalDocuments != null && !ObjectUtils.isEmpty(additionalDocuments.getDocuments())) {
            attachments.addAll(additionalDocuments.getDocuments());
        }
        if (operatorDetails != null && !ObjectUtils.isEmpty(operatorDetails.getAttachmentIds())) {
            attachments.addAll(operatorDetails.getAttachmentIds());
        }
        if (smf != null && !ObjectUtils.isEmpty(smf.getAttachmentIds())) {
            attachments.addAll(smf.getAttachmentIds());
        }

        return Collections.unmodifiableSet(attachments);
    }
}
