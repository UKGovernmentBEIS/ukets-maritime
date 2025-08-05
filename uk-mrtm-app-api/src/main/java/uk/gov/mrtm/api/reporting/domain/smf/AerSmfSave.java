package uk.gov.mrtm.api.reporting.domain.smf;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.ObjectUtils;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#exist) == (#smfDetails != null)}", message = "aer.smf.exist")
public class AerSmfSave {

    @NotNull
    private Boolean exist;

    @Valid
    private AerSmfDetailsSave smfDetails;

    @JsonIgnore
    public Set<UUID> getAttachmentIds() {
        Set<UUID> attachments = new HashSet<>();
        if (smfDetails != null && !ObjectUtils.isEmpty(smfDetails.getAttachmentIds())) {
            attachments.addAll(smfDetails.getAttachmentIds());
        }
        return Collections.unmodifiableSet(attachments);
    }

}
