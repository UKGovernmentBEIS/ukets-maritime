package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.EmpFuelsAndEmissionsFactors;
import uk.gov.netz.api.common.validation.SpELExpression;


@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@SpELExpression(expression = "{(#type eq 'OTHER') == (#name != null)}",
    message = "emp.invalid.bio.fuel.emissions")
@NoArgsConstructor
public class EmpBioFuels extends EmpFuelsAndEmissionsFactors {

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

