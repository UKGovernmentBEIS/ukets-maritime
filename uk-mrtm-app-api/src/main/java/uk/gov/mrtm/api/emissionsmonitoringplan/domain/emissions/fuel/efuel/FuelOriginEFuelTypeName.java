package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class FuelOriginEFuelTypeName extends FuelOriginTypeName {

    @NotNull
    private EFuelType type;

    @Override
    public String getTypeAsString() {
        return type.name();
    }

    @Override
    public String getLongDescription() {
        if (type == EFuelType.OTHER) {
            return getOrigin().getDescription() + "/ Other e-fuel/ " + getName();
        } else {
            return getOrigin().getDescription() + "/ " + getType().getDescription();
        }
    }
}
