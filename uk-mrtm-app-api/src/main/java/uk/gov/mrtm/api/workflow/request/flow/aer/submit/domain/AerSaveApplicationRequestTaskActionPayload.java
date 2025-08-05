package uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.AerReportingObligationDetails;
import uk.gov.mrtm.api.reporting.domain.AerSave;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AerSaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {

    private Boolean reportingRequired;

    private AerReportingObligationDetails reportingObligationDetails;

    private AerSave aer;

    @Builder.Default
    private Map<String, String> aerSectionsCompleted = new HashMap<>();
}
