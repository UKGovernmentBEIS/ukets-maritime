package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import io.swagger.v3.oas.annotations.media.Schema;
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

    @Schema(description = "Method for determining of density of fuel bunkered")
    private final String description;
}
