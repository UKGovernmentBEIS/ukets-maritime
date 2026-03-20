package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.verification.AerNotVerifiedDecisionReasonType;
import uk.gov.netz.api.common.validation.SpELExpression;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueField;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{(#type eq 'UNCORRECTED_MATERIAL_MISSTATEMENT' || #type eq 'UNCORRECTED_MATERIAL_NON_CONFORMITY') == (#details == null)}",
        message = "aerVerificationData.decision.notVerifiedDecisionReason.details")
public class ExternalAerNotVerifiedDecisionReason {

    @UniqueField
    @NotNull
    @Schema(description = "Decision reason type that the report cannot be verified")
    private AerNotVerifiedDecisionReasonType type;

    @Size(max = 10000)
    @Schema(description = "Decision reason details. Must be provided if type is 'VERIFICATION_DATA_OR_INFORMATION_LIMITATIONS', 'SCOPE_LIMITATIONS_DUE_TO_LACK_OF_CLARITY', 'SCOPE_LIMITATIONS_OF_APPROVED_MONITORING_PLAN', 'NOT_APPROVED_MONITORING_PLAN_BY_REGULATOR' or 'ANOTHER_REASON'")
    private String details;
}
