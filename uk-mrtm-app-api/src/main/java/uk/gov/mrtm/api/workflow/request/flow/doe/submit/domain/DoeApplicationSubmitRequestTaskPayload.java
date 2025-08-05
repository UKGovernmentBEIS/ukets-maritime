package uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class DoeApplicationSubmitRequestTaskPayload extends RequestTaskPayload {

    private Doe doe;

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<UUID, String> doeAttachments = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return getDoeAttachments();
    }

    @Override
    public Set<UUID> getReferencedAttachmentIds() {
        return doe != null && doe.getMaritimeEmissions() != null && doe.getMaritimeEmissions().getTotalMaritimeEmissions() != null
            ? Collections.unmodifiableSet(doe.getMaritimeEmissions().getTotalMaritimeEmissions().getSupportingDocuments())
            : Collections.emptySet();
    }
}
