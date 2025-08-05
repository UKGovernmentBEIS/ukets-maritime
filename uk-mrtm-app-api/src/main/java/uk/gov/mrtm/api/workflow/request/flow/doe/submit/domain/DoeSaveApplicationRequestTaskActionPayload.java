package uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class DoeSaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {

    private Doe doe;

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();
}
