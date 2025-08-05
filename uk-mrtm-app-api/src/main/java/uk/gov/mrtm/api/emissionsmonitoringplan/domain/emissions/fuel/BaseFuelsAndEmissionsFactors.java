package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
public abstract class BaseFuelsAndEmissionsFactors {

    @NotNull
    private FuelOrigin origin;

    @Size(max = 30)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String name;

    @NotNull
    @Digits(integer = 12, fraction = Integer.MAX_VALUE)
    @PositiveOrZero
    private BigDecimal carbonDioxide;

    @NotNull
    @Digits(integer = 12, fraction = Integer.MAX_VALUE)
    @PositiveOrZero
    private BigDecimal methane;

    @NotNull
    @Digits(integer = 12, fraction = Integer.MAX_VALUE)
    @PositiveOrZero
    private BigDecimal nitrousOxide;

    @PositiveOrZero
    @Digits(integer=3, fraction=2)
    @DecimalMax(value = "100")
    private BigDecimal sustainableFraction;

    @NotNull
    private UUID uniqueIdentifier;

    @JsonIgnore
    public String carbonDioxideAsString() {
        return carbonDioxide.toString();
    }

    @JsonIgnore
    public String methaneAsString() {
        return methane.toString();
    }

    @JsonIgnore
    public String nitrousOxideAsString() {
        return nitrousOxide.toString();
    }
}
