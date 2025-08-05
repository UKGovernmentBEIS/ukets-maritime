package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FossilFuelType {
    HFO("Heavy Fuel Oil (HFO)"),
    LFO("Light Fuel Oil (LFO)"),
    MDO("Diesel Oil (MDO)"),
    MGO("Gas Oil (MGO)"),
    LNG("Liquified Natural Gas (LNG)"),
    LPG_BUTANE("Liquefied Petroleum Gas (Butane, LPG)"),
    LPG_PROPANE("Liquefied Petroleum Gas (Propane, LPG)"),
    H2("H2"),
    NH3("NH3"),
    METHANOL("Methanol"),
    OTHER("Other");

    private final String description;
}
