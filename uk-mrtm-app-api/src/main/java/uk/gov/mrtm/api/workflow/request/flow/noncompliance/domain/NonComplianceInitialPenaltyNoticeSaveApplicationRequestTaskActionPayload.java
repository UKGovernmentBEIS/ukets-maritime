package uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class NonComplianceInitialPenaltyNoticeSaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {

    @NotNull
    private UUID initialPenaltyNotice;

    @Size(max = 10000)
    private String comments;

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();
}
