package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class FuelOriginFossilTypeName extends FuelOriginTypeName {

    @NotNull
    private FossilFuelType type;

    @Override
    public String getLongDescription() {
        if (type == FossilFuelType.OTHER) {
            return getOrigin().getDescription() + "/ Other Fossil Fuel/ " + getName();
        } else {
            return getOrigin().getDescription() + "/ " + getType().getDescription();
        }
    }
}
