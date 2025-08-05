package uk.gov.mrtm.api.reporting.domain.aggregateddata;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurementSave;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AerAggregatedEmissionsMeasurementSave extends AerPortEmissionsMeasurementSave {

    @NotNull
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction= 7)
    private BigDecimal co2Captured;
}
