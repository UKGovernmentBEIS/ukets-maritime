package uk.gov.mrtm.api.reporting.domain.emissions.fuel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.BaseFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;

@Schema(
    discriminatorMapping = {
        @DiscriminatorMapping(schema = AerFossilFuels.class, value = "FOSSIL"),
        @DiscriminatorMapping(schema = AerBioFuels.class, value = "BIOFUEL"),
        @DiscriminatorMapping(schema = AerEFuels.class, value = "RFNBO")
    },
    discriminatorProperty = "origin")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "origin", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = AerFossilFuels.class, name = "FOSSIL"),
    @JsonSubTypes.Type(value = AerBioFuels.class, name = "BIOFUEL"),
    @JsonSubTypes.Type(value = AerEFuels.class, name = "RFNBO")
})
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public abstract class AerFuelsAndEmissionsFactors extends BaseFuelsAndEmissionsFactors {

    @JsonIgnore
    public abstract String getTypeAsString();

    @JsonIgnore
    public abstract String getLongDescription();
}
