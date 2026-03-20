package uk.gov.mrtm.api.integration.external.verification.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.integration.external.verification.domain.common.ExternalVerifierComment;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#exist) == (#recommendedImprovements?.size() gt 0)}", message = "aerVerificationData.recommendedImprovements.exist")
public class ExternalAerRecommendedImprovements {

    @NotNull
    @Schema(description = "Indicates if there are any recommended improvements")
    private Boolean exist;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    @Valid
    @JsonDeserialize(as = LinkedHashSet.class)
    @Schema(description = "Recommended improvements. Required only when 'exist' is true, otherwise must be omitted")
    private Set<@NotNull ExternalVerifierComment> recommendedImprovements = new LinkedHashSet<>();
}
