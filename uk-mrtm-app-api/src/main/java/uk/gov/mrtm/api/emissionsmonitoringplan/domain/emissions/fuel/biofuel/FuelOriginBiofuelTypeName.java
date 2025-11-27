package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class FuelOriginBiofuelTypeName extends FuelOriginTypeName {

    @NotNull
    private BioFuelType type;

    @Override
    public String getTypeAsString() {
        return type.name();
    }

    @Override
    public String getLongDescription() {
        if (type == BioFuelType.OTHER) {
            return getOrigin().getDescription() + "/ Other BioFuel/ " + getName();
        } else {
            return getOrigin().getDescription() + "/ " + getType().getDescription();
        }
    }
}
