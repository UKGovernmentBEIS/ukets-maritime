package uk.gov.mrtm.api.workflow.request.flow.vir.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.common.VerifierComment;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Data
@EqualsAndHashCode
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{(#uncorrectedNonConformities?.size() gt 0) or (#priorYearIssues?.size() gt 0)  or (#recommendedImprovements?.size() gt 0)}", message = "virVerificationData.notEmpty")
public class VirVerificationData {
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    @Valid
    @JsonDeserialize(as = LinkedHashMap.class)
    private Map<String, @NotNull @Valid UncorrectedItem> uncorrectedNonConformities = new HashMap<>();

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    @Valid
    @JsonDeserialize(as = LinkedHashMap.class)
    private Map<String, @NotNull @Valid VerifierComment> priorYearIssues = new HashMap<>();

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    @Valid
    @JsonDeserialize(as = LinkedHashMap.class)
    private Map<String, @NotNull @Valid VerifierComment> recommendedImprovements = new HashMap<>();
}
