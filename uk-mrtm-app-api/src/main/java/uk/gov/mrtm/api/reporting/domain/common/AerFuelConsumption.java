package uk.gov.mrtm.api.reporting.domain.common;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.enumeration.MeasuringUnit;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#fuelDensity != null) == (#measuringUnit eq 'M3')}", message = "aer.fuel.consumption.measuring.unit.invalid")
@SpELExpression(expression = "{(#fuelOriginTypeName?.type eq 'LNG' || #fuelOriginTypeName?.type eq 'BIO_LNG' || #fuelOriginTypeName?.type eq 'E_LNG' || #fuelOriginTypeName?.type eq 'OTHER') ? " +
        "(#fuelOriginTypeName?.methaneSlip != null && #fuelOriginTypeName?.methaneSlipValueType == null) : " +
        "(#fuelOriginTypeName?.methaneSlip == null && #fuelOriginTypeName?.methaneSlipValueType == null)}",
        message = "emp.invalid.fuel.details.methane.slip")
public class AerFuelConsumption {
    @NotNull
    private UUID uniqueIdentifier;

    @NotNull
    @Valid
    private FuelOriginTypeName fuelOriginTypeName;

    @Size(max = 30)
    private String name;

    @NotNull
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 5)
    private BigDecimal amount;

    @NotNull
    private MeasuringUnit measuringUnit;

    @Positive
    @Digits(integer = 1, fraction = 3)
    @DecimalMax(value = "1")
    private BigDecimal fuelDensity;

    @NotNull
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 5)
    private BigDecimal totalConsumption;
}
