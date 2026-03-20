package uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AerVerificationImportThirdPartyDataRequestTaskActionPayload extends RequestTaskActionPayload {

    @Builder.Default
    private Map<String, String> verificationSectionsCompleted = new HashMap<>();
}
