package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EmissionSourceType {
    MAIN_ENGINE("Main engines"),
    AUX_ENGINE("Auxiliary engines"),
    GAS_TURBINE("Gas turbines"),
    BOILER("Boilers"),
    INERT_GAS_GENERATOR("Inert gas generators"),
    FUEL_CELLS("Fuel cells"),
    WASTE_INCINERATOR("Waste incinerators"),
    OTHER("Other");

    private final String description;
}
