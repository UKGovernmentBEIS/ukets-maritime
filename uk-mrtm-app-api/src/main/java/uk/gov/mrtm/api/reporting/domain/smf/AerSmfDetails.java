package uk.gov.mrtm.api.reporting.domain.smf;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.ObjectUtils;

import java.math.BigDecimal;
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
public class AerSmfDetails {

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @NotEmpty
    private List<@NotNull @Valid AerSmfPurchase> purchases = new ArrayList<>();

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction = 7)
    @Positive
    private BigDecimal totalSustainableEmissions;

    @JsonIgnore
    public Set<UUID> getAttachmentIds() {
        Set<UUID> attachments = new HashSet<>();

        if (purchases != null && !ObjectUtils.isEmpty(purchases)) {
            attachments.addAll(purchases.stream()
                    .map(AerSmfPurchase::getEvidenceFiles)
                    .flatMap(Set::stream)
                    .collect(Collectors.toSet()));
        }
        return Collections.unmodifiableSet(attachments);
    }
}
