package uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AerSaveApplicationVerificationRequestTaskActionPayload extends RequestTaskActionPayload {

    @JsonUnwrapped
    private AerVerificationData verificationData;

    @Builder.Default
    private Map<String, String> verificationSectionsCompleted = new HashMap<>();
}
