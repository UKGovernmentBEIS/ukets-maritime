package uk.gov.mrtm.api.integration.external.aer.domain.shipemissions;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#fuelTypeCode eq 'OTHER') == (#otherFuelType != null)}",
    message = "emp.external.fuelTypeCode.other.otherFuelType.constraint")
@SpELExpression(
    expression = "{T(uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType).validateFuelOrigin(#fuelTypeCode, #fuelOriginCode)}",
    message = "emp.external.fuelTypeCode.origin.constraint"
)
@SpELExpression(expression = "{(" +
    "#fuelTypeCode eq 'HFO' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('3.114')) == 0 " +

    ")||(" +

    "#fuelTypeCode eq 'LFO' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('3.151')) == 0 " +

    ")||(" +

    "#fuelTypeCode eq 'MDO' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('3.206')) == 0 " +

    ")||(" +

    "#fuelTypeCode eq 'MGO' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('3.206')) == 0 " +

    ")||(" +

    "#fuelTypeCode eq 'LNG' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('2.75')) == 0 " +

    ")||(" +

    "#fuelTypeCode eq 'LPG_BUTANE' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('3.03')) == 0 " +

    ")||(" +

    "#fuelTypeCode eq 'LPG_PROPANE' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('3')) == 0 " +

    ")||(" +

    "#fuelTypeCode eq 'H2' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('0')) == 0 " +

    ")||(" +

    "#fuelTypeCode eq 'NH3' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('0')) == 0 " +

    ")||(" +

    "#fuelTypeCode eq 'METHANOL' " +
    "&& #ttwEFCarbonDioxide?.compareTo(new java.math.BigDecimal('1.375')) == 0 " +

    ")||(" +

    "!T(java.util.Arrays).asList(" +
    "'HFO', 'LFO', 'MDO', 'MGO', 'LNG', 'LPG_BUTANE', 'LPG_PROPANE', 'H2', 'NH3', 'METHANOL'" +
    ").contains(#fuelTypeCode)" +

    ")}",
    message = "emp.external.invalid.carbon.dioxide.value")
public class ExternalAerFuelsAndEmissionsFactors {

    @NotNull
    private FuelOrigin fuelOriginCode;

    @NotNull
    private ExternalFuelType fuelTypeCode;

    @Schema(description = "Description of the fuel type if not listed (fuelTypeCode OTHER)")
    @Size(max = 30)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String otherFuelType;

    @Schema(description = "Tank to wake emission factor for carbonDioxide. Positive or zero decimal number with integer part max 12 digits", minimum = "0")
    @NotNull
    @Digits(integer = 12, fraction = Integer.MAX_VALUE)
    @PositiveOrZero
    private BigDecimal ttwEFCarbonDioxide;

    @Schema(description = "Tank to wake emission factor for methane. Positive or zero decimal number with integer part max 12 digits", minimum = "0")
    @NotNull
    @Digits(integer = 12, fraction = Integer.MAX_VALUE)
    @PositiveOrZero
    private BigDecimal ttwEFMethane;

    @Schema(description = "Tank to wake emission factor for nitrousOxide. Positive or zero decimal number with integer part max 12 digits", minimum = "0")
    @NotNull
    @Digits(integer = 12, fraction = Integer.MAX_VALUE)
    @PositiveOrZero
    private BigDecimal ttwEFNitrousOxide;
}
