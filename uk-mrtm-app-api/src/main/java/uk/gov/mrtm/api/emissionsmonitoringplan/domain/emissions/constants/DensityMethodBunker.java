package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DensityMethodBunker {
    ON_BOARD_MEASUREMENT_SYSTEMS("On board measurement systems"),
    FUEL_SUPPLIER("Fuel supplier"),
    LABORATORY_TEST("Laboratory test"),
    NA("Not applicable")
    ;

    private final String description;
}
