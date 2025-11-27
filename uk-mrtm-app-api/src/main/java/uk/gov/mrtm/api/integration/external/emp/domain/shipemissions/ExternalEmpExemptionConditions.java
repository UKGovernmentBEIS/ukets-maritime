package uk.gov.mrtm.api.integration.external.emp.domain.shipemissions;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#derogationCodeUsed) == (#minimumNumberOfVoyages != null)}",
    message = "emp.external.emission.exemptionconditions.derogationCodeUsed")
public class ExternalEmpExemptionConditions {

    @Schema(description = "Derogation for monitoring the amount of fuel consumed used. If true, minimumNumberOfVoyages is required")
    @NotNull
    private Boolean derogationCodeUsed;

    @Min(301)
    private Integer minimumNumberOfVoyages;
}
