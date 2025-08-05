package uk.gov.mrtm.api.reporting.domain.totalemissions;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AerTotalEmissions {

    @NotNull
    @Valid
    private AerPortEmissionsMeasurement totalEmissions;

    @NotNull
    @Valid
    private AerPortEmissionsMeasurement lessCapturedCo2;

    @NotNull
    @Valid
    private AerPortEmissionsMeasurement lessVoyagesNotInScope;

    @NotNull
    @Valid
    private AerPortEmissionsMeasurement lessAnyERC;

    @NotNull
    @Valid
    private AerPortEmissionsMeasurement lessIslandFerryDeduction;

    @NotNull
    @Valid
    private AerPortEmissionsMeasurement less5PercentIceClassDeduction;

    @NotNull
    @Valid
    @Positive
    @Digits(integer = Integer.MAX_VALUE, fraction= 7)
    private BigDecimal totalShipEmissions;

    @NotNull
    @Valid
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction= 7)
    private BigDecimal surrenderEmissions;

    @NotNull
    @Valid
    @Positive
    @Digits(integer = Integer.MAX_VALUE, fraction= 0)
    private BigDecimal totalShipEmissionsSummary;

    @NotNull
    @Valid
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction= 0)
    private BigDecimal surrenderEmissionsSummary;
}
