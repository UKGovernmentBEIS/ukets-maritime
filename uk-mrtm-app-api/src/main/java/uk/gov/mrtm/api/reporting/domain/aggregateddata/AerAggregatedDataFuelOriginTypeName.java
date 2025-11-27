package uk.gov.mrtm.api.reporting.domain.aggregateddata;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.AerFuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.AerFuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.AerFuelOriginFossilTypeName;

import java.util.UUID;

@Schema(
    discriminatorMapping = {
        @DiscriminatorMapping(schema = AerFuelOriginFossilTypeName.class, value = "FOSSIL"),
        @DiscriminatorMapping(schema = AerFuelOriginBiofuelTypeName.class, value = "BIOFUEL"),
        @DiscriminatorMapping(schema = AerFuelOriginEFuelTypeName.class, value = "RFNBO")
    },
    discriminatorProperty = "origin")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "origin", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = AerFuelOriginFossilTypeName.class, name = "FOSSIL"),
    @JsonSubTypes.Type(value = AerFuelOriginBiofuelTypeName.class, name = "BIOFUEL"),
    @JsonSubTypes.Type(value = AerFuelOriginEFuelTypeName.class, name = "RFNBO")
})
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class AerAggregatedDataFuelOriginTypeName {

    @NotNull
    @EqualsAndHashCode.Include
    private FuelOrigin origin;

    @EqualsAndHashCode.Include
    private String name;

    @NotNull
    private UUID uniqueIdentifier;
}
