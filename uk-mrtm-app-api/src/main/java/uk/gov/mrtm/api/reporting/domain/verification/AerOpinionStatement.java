package uk.gov.mrtm.api.reporting.domain.verification;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#additionalChangesNotCovered) == (#additionalChangesNotCoveredDetails != null)}", message = "aerVerificationData.opinionStatement.additionalChangesNotCovered.details")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#emissionsCorrect) == (#manuallyProvidedTotalEmissions != null)}", message = "aerVerificationData.opinionStatement.emissionsCorrect.manuallyProvidedTotalEmissions")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#emissionsCorrect) == (#manuallyProvidedSurrenderEmissions != null)}", message = "aerVerificationData.opinionStatement.emissionsCorrect.manuallyProvidedSurrenderEmissions")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#emissionsCorrect) == (#manuallyProvidedLessIslandFerryDeduction != null)}", message = "aerVerificationData.opinionStatement.emissionsCorrect.manuallyProvidedLessIslandFerryDeduction")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#emissionsCorrect) == (#manuallyProvidedLess5PercentIceClassDeduction != null)}", message = "aerVerificationData.opinionStatement.emissionsCorrect.manuallyProvidedLess5PercentIceClassDeduction")
public class AerOpinionStatement {

    @NotNull
    private Boolean emissionsCorrect;

    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal manuallyProvidedTotalEmissions;

    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal manuallyProvidedSurrenderEmissions;

    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal manuallyProvidedLessIslandFerryDeduction;

    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal manuallyProvidedLess5PercentIceClassDeduction;

    @NotNull
    private Boolean additionalChangesNotCovered;

    private String additionalChangesNotCoveredDetails;

    @NotNull
    @Valid
    private AerSiteVisit siteVisit;
}
