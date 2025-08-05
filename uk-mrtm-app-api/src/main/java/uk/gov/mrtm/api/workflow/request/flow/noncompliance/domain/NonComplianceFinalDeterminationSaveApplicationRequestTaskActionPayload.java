package uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
public class NonComplianceFinalDeterminationSaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {

    @NotNull
    @Valid
    @JsonUnwrapped
    private NonComplianceFinalDetermination finalDetermination;

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();
}
