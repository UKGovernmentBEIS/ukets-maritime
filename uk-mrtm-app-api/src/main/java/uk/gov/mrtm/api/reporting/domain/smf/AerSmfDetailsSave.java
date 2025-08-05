package uk.gov.mrtm.api.reporting.domain.smf;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AerSmfDetailsSave {

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @NotEmpty
    private List<@NotNull @Valid AerSmfPurchaseSave> purchases = new ArrayList<>();

    @JsonIgnore
    public Set<UUID> getAttachmentIds() {
        Set<UUID> attachments = new HashSet<>();

        if (purchases != null && !ObjectUtils.isEmpty(purchases)) {
            attachments.addAll(purchases.stream()
                    .map(AerSmfPurchaseSave::getEvidenceFiles)
                    .flatMap(Set::stream)
                    .collect(Collectors.toSet()));
        }
        return Collections.unmodifiableSet(attachments);
    }
}
