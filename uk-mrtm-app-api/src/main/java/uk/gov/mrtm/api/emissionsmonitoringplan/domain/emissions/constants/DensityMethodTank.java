package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DensityMethodTank {
    MEASUREMENT_SYSTEMS("Measurement systems"),
    FUEL_SUPPLIER("Fuel supplier"),
    LABORATORY_TEST("Laboratory test"),
    NA("Not applicable")
    ;

    @Schema(description = "Method for determination of density of fuel in tanks")
    private final String description;
}
