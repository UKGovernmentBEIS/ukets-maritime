package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;

import java.math.BigDecimal;
import java.util.UUID;

@Schema(
        discriminatorMapping = {
                @DiscriminatorMapping(schema = FuelOriginFossilTypeName.class, value = "FOSSIL"),
                @DiscriminatorMapping(schema = FuelOriginBiofuelTypeName.class, value = "BIOFUEL"),
                @DiscriminatorMapping(schema = FuelOriginEFuelTypeName.class, value = "RFNBO")
        },
        discriminatorProperty = "origin")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "origin", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = FuelOriginFossilTypeName.class, name = "FOSSIL"),
        @JsonSubTypes.Type(value = FuelOriginBiofuelTypeName.class, name = "BIOFUEL"),
        @JsonSubTypes.Type(value = FuelOriginEFuelTypeName.class, name = "RFNBO")
})
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class FuelOriginTypeName {

    @EqualsAndHashCode.Include
    @NotNull
    private FuelOrigin origin;

    @EqualsAndHashCode.Include
    private String name;

    @NotNull
    private UUID uniqueIdentifier;

    @PositiveOrZero
    @Digits(integer=3, fraction=2)
    @DecimalMax(value = "100")
    @EqualsAndHashCode.Include
    private BigDecimal methaneSlip;

    @EqualsAndHashCode.Include
    private MethaneSlipValueType methaneSlipValueType;

    @JsonIgnore
    public abstract String getLongDescription();
}
