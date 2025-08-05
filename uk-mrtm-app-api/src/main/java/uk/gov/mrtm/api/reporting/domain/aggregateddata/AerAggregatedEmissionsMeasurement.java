package uk.gov.mrtm.api.reporting.domain.aggregateddata;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AerAggregatedEmissionsMeasurement extends AerPortEmissionsMeasurement {

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction= 7)
    private BigDecimal co2Captured;
}
