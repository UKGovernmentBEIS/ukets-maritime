package uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalAerAggregatedDataEmissionsMeasurements {

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction= 7)
    @Schema(description = "Carbon dioxide. Positive or zero decimal number with fraction part max 7 digits")
    private BigDecimal tco2Total;

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction= 7)
    @Schema(description = "Methane. Positive or zero decimal number with fraction part max 7 digits")
    private BigDecimal tch4eqTotal;

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction= 7)
    @Schema(description = "Nitrous oxide. Positive or zero decimal number with fraction part max 7 digits")
    private BigDecimal tn2oeqTotal;
}
