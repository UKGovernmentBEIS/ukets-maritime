package uk.gov.mrtm.api.reporting.domain.smf;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelOriginTypeName;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AerSmfPurchaseSave {

    @NotNull
    @Valid
    private AerAggregatedDataFuelOriginTypeName fuelOriginTypeName;

    @NotBlank
    @Size(max = 500)
    private String batchNumber;

    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction = 5)
    @Positive
    private BigDecimal smfMass;

    @NotNull
    @Digits(integer = 12, fraction = Integer.MAX_VALUE)
    @PositiveOrZero
    private BigDecimal co2EmissionFactor;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<UUID> evidenceFiles = new HashSet<>();
}
