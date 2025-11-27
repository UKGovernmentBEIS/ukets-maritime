package uk.gov.mrtm.api.integration.external.emp.domain.shipemissions;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.math.BigDecimal;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(
    expression = "{(#fuelTypeCode eq 'LNG' || #fuelTypeCode eq 'BIO_LNG' || #fuelTypeCode eq 'E_LNG' || #fuelTypeCode eq 'OTHER') == " +
        "(#slipPercentage != null)}",
    message = "emp.external.invalid.fuel.details.methane.slip"
)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ExternalEmpFuelOriginTypeName {

    @NotNull
    @EqualsAndHashCode.Include
    private FuelOrigin fuelOriginCode;

    @NotNull
    @EqualsAndHashCode.Include
    private ExternalFuelType fuelTypeCode;

    @Size(max = 30)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @EqualsAndHashCode.Include
    private String otherFuelType;

    @Schema(description = "Slip percentage value. Decimal number between 0 and 100 (inclusive) with up to 3 integer digits and 2 fractional digits")
    @PositiveOrZero
    @Digits(integer=3, fraction=2)
    @DecimalMax(value = "100")
    private BigDecimal slipPercentage;
}
