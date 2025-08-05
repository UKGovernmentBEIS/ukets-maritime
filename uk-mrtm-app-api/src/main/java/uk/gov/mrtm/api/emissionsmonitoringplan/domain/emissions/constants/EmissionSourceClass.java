package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EmissionSourceClass {

    BOILERS("Boilers"),
    FUEL_CELLS("Fuel Cells"),
    GAS_TURBINE("Gas Turbine"),
    ICE("ICE"),
    INERT_GAS_GENERATOR("Inert Gas Generator"),
    LNG_DIESEL_DFSS("LNG Diesel (DFSS)"),
    LNG_LBSI("LNG (LBSI)"),
    LNG_OTTO_DFMS("LNG Otto (DFMS)"),
    LNG_OTTO_DFSS("LNG Otto (DFSS)"),
    WASTE_INCINERATORS("Waste Incinerators");

    private final String description;
}
