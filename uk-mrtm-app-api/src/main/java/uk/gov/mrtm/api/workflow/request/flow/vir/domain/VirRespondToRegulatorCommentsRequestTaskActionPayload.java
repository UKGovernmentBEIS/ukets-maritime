package uk.gov.mrtm.api.workflow.request.flow.vir.domain;

import jakarta.validation.constraints.NotBlank;
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
public abstract class VirRespondToRegulatorCommentsRequestTaskActionPayload extends RequestTaskActionPayload {

    @NotBlank
    private String reference;

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();
}
