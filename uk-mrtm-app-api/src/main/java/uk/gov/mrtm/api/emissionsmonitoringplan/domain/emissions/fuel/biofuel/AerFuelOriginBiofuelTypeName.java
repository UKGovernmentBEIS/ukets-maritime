package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelOriginTypeName;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class AerFuelOriginBiofuelTypeName extends AerAggregatedDataFuelOriginTypeName {

    @NotNull
    private BioFuelType type;

    @Override
    public String getTypeAsString() {
        return type.name();
    }
}
