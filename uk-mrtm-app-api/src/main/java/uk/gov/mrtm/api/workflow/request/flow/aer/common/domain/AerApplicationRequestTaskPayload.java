package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.apache.commons.lang3.ObjectUtils;
import uk.gov.mrtm.api.reporting.domain.Aer;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AerApplicationRequestTaskPayload extends AerApplicationAbstractRequestTaskPayload {

    private Aer aer;

    @Override
    public Map<UUID, String> getAttachments() {
        return getAerAttachments();
    }

    @Override
    public Set<UUID> getReferencedAttachmentIds() {
        Set<UUID> attachments = new HashSet<>(super.getReferencedAttachmentIds());
        if (getAer() != null && !ObjectUtils.isEmpty(getAer().getAerSectionAttachmentIds())) {
            attachments.addAll(getAer().getAerSectionAttachmentIds());
        }
        return Collections.unmodifiableSet(attachments);
    }
}
