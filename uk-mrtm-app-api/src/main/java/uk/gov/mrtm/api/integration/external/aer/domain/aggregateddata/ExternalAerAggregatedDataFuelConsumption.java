package uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata;

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

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalAerAggregatedDataFuelConsumption {

    @NotNull
    private FuelOrigin fuelOriginCode;

    @NotNull
    private ExternalFuelType fuelTypeCode;

    @Schema(description = "Description of the fuel type if not listed. Must be provided only when 'fuelTypeCode' is 'OTHER'")
    @Size(max = 30)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String otherFuelType;

    @NotNull
    @PositiveOrZero
    @Digits(integer = Integer.MAX_VALUE, fraction = 5)
    @Schema(description = "Fuel consumption amount. Positive or zero decimal number with fraction part max 5 digits", minimum = "0")
    private BigDecimal amount;
}
