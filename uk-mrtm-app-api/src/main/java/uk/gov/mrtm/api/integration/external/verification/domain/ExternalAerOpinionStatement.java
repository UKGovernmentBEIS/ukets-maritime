package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
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
@SpELExpression(expression = "{(T(java.lang.Boolean).TRUE.equals(#emissionsCorrect) || (#manuallyProvidedTotalEmissions != null && #manuallyProvidedLessVoyagesInNorthernIrelandDeduction != null && #manuallyProvidedTotalEmissions?.compareTo(#manuallyProvidedLessVoyagesInNorthernIrelandDeduction) >= 0))}",
    message = "aerVerificationData.opinionStatement.ni.must.be.less.than.total")
@SpELExpression(expression = "{(T(java.lang.Boolean).TRUE.equals(#emissionsCorrect) || (#manuallyProvidedLessVoyagesInNorthernIrelandDeduction != null && #manuallyProvidedSurrenderEmissions != null && #manuallyProvidedLessVoyagesInNorthernIrelandDeduction?.compareTo(#manuallyProvidedSurrenderEmissions) >= 0))}",
    message = "aerVerificationData.opinionStatement.surrender.must.be.less.than.ni")
public class ExternalAerOpinionStatement {

    @NotNull
    @Schema(description = "Indicates if the reporting and surrender obligation emissions are correct")
    private Boolean emissionsCorrect;

    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    @Schema(description = "Total verified maritime emissions for the scheme year. Required only when 'emissionsCorrect' is false, otherwise must be omitted")
    private BigDecimal manuallyProvidedTotalEmissions;

    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    @Schema(description = "Emissions figure for surrender for the scheme year. Required only when 'emissionsCorrect' is false, otherwise must be omitted")
    private BigDecimal manuallyProvidedSurrenderEmissions;

    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    @Schema(description = "Less Northern Ireland surrender deduction. Required only when 'emissionsCorrect' is false, otherwise must be omitted")
    private BigDecimal manuallyProvidedLessVoyagesInNorthernIrelandDeduction;

    @NotNull
    @Schema(description = "Indicates if there are any changes to the emissions monitoring plan during the scheme year")
    private Boolean additionalChangesNotCovered;

    @Schema(description = "List the agreed changes, including the date and type of communication. Required only when 'additionalChangesNotCovered' is true, otherwise must be omitted")
    @Size(max = 10000)
    private String additionalChangesNotCoveredDetails;

    @NotNull
    @Valid
    @Schema(description = "Site verification")
    private ExternalAerSiteVisit siteVisit;
}
