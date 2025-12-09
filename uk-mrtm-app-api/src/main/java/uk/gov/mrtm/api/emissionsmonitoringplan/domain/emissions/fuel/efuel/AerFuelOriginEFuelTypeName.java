package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelOriginTypeName;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class AerFuelOriginEFuelTypeName extends AerAggregatedDataFuelOriginTypeName {

    @NotNull
    private EFuelType type;

    @Override
    public String getTypeAsString() {
        return type.name();
    }
}
