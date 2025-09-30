package uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class NonComplianceFinalDeterminationRequestTaskPayload extends NonComplianceDetailsRequestTaskPayload implements NonComplianceRequestTaskClosable {

    @NotNull
    @Valid
    @JsonUnwrapped
    private NonComplianceFinalDetermination finalDetermination;

    @JsonIgnore
    private NonComplianceCloseJustification closeJustification;

    @Builder.Default
    private Map<UUID, String> nonComplianceAttachments = new HashMap<>();

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return this.getNonComplianceAttachments();
    }

    @Override
    public Set<UUID> getReferencedAttachmentIds() {
        return this.closeJustification != null ? this.closeJustification.getFiles() : Set.of();
    }
}
