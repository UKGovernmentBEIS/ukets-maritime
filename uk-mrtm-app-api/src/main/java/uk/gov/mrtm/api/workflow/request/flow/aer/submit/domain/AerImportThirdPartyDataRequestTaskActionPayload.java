package uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain;

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
public class AerImportThirdPartyDataRequestTaskActionPayload extends RequestTaskActionPayload {

    @Builder.Default
    private Map<String, String> aerSectionsCompleted = new HashMap<>();
}
