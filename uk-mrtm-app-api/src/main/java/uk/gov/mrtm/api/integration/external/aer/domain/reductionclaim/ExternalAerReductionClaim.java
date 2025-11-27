package uk.gov.mrtm.api.integration.external.aer.domain.reductionclaim;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#reductionClaimApplied) == (#reductionClaimDetails != null)}", message = "aer.external.smf.reductionClaimApplied")
public class ExternalAerReductionClaim {

    @NotNull
    @Schema(description = "If true, the reduction claim data are required, otherwise must be omitted")
    private Boolean reductionClaimApplied;

    @Valid
    private ExternalAerReductionClaimDetails reductionClaimDetails;
}
