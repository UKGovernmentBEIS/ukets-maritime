package uk.gov.mrtm.api.integration.external.aer.domain.reductionclaim;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
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
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalAerReductionClaimPurchase {

    @NotNull
    private FuelOrigin fuelOriginCode;

    @NotNull
    private ExternalFuelType fuelTypeCode;

    @Schema(description = "Description of the fuel type if not listed. Must be provided only when 'fuelTypeCode' is 'OTHER'")
    @Size(max = 30)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String otherFuelType;

    @NotBlank
    @Size(min = 1, max = 500)
    private String batchNumber;

    @Schema(description = "Fuel mass. Positive decimal number with fraction part max 5 digits", minimum = "0", exclusiveMinimum = true)
    @NotNull
    @Digits(integer = Integer.MAX_VALUE, fraction = 5)
    @Positive
    private BigDecimal fuelMass;

    @Schema(description = "Tank to wake emission factor for carbonDioxide. Positive or zero decimal number with integer part max 12 digits", minimum = "0")
    @NotNull
    @Digits(integer = 12, fraction = Integer.MAX_VALUE)
    @PositiveOrZero
    private BigDecimal ttwEFCarbonDioxide;
}
