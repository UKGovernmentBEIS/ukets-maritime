package uk.gov.mrtm.api.reporting.domain.aggregateddata;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AerAggregatedDataFuelConsumption {

    @NotNull
    @Valid
    private AerAggregatedDataFuelOriginTypeName fuelOriginTypeName;

    @NotNull
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 5)
    private BigDecimal totalConsumption;
}
