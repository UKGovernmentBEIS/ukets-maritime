package uk.gov.mrtm.api.reporting.domain.verification;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
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
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#emissionsCorrect) == (#manuallyProvidedLessVoyagesInNorthernIrelandDeduction != null)}", message = "aerVerificationData.opinionStatement.emissionsCorrect.manuallyProvidedLessVoyagesInNorthernIrelandDeduction")
@SpELExpression(expression = "{(T(java.lang.Boolean).TRUE.equals(#emissionsCorrect) || #manuallyProvidedTotalEmissions?.compareTo(#manuallyProvidedLessVoyagesInNorthernIrelandDeduction) >= 0)}",
    message = "aerVerificationData.opinionStatement.ni.must.be.less.than.total")
@SpELExpression(expression = "{(T(java.lang.Boolean).TRUE.equals(#emissionsCorrect) || #manuallyProvidedLessVoyagesInNorthernIrelandDeduction?.compareTo(#manuallyProvidedSurrenderEmissions) >= 0)}",
    message = "aerVerificationData.opinionStatement.surrender.must.be.less.than.ni")
public class AerOpinionStatement {

    @NotNull
    private Boolean emissionsCorrect;

    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal manuallyProvidedTotalEmissions;

    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal manuallyProvidedSurrenderEmissions;

    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal manuallyProvidedLessVoyagesInNorthernIrelandDeduction;

    @NotNull
    private Boolean additionalChangesNotCovered;

    private String additionalChangesNotCoveredDetails;

    @NotNull
    @Valid
    private AerSiteVisit siteVisit;
}
