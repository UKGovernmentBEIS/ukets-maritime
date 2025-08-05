package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodBunker;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodTank;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.EmpBioFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.EmpEFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.EmpFossilFuels;

@Schema(
    discriminatorMapping = {
        @DiscriminatorMapping(schema = EmpFossilFuels.class, value = "FOSSIL"),
        @DiscriminatorMapping(schema = EmpBioFuels.class, value = "BIOFUEL"),
        @DiscriminatorMapping(schema = EmpEFuels.class, value = "RFNBO")
    },
    discriminatorProperty = "origin")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "origin", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = EmpFossilFuels.class, name = "FOSSIL"),
    @JsonSubTypes.Type(value = EmpBioFuels.class, name = "BIOFUEL"),
    @JsonSubTypes.Type(value = EmpEFuels.class, name = "RFNBO")
})
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public abstract class EmpFuelsAndEmissionsFactors extends BaseFuelsAndEmissionsFactors {

    @NotNull
    private DensityMethodBunker densityMethodBunker;

    @NotNull
    private DensityMethodTank densityMethodTank;

    @JsonIgnore
    public abstract String getTypeAsString();

    @JsonIgnore
    public abstract String getLongDescription();
}
