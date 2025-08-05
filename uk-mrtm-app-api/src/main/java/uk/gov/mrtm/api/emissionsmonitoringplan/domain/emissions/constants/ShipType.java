package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ShipType {
    PAX("Passenger Ship"),
    RORO("Ro-ro ship"),
    CONT("Container Ship"),
    OIL("Oil tanker"),
    CHEM("Chemical tanker"),
    LNG("LNG Carrier"),
    GAS("Gas Carrier"),
    BULK("Bulk carrier"),
    GENERAL("General cargo ship"),
    RCV("Refrigerated cargo ship"),
    VEH("Vehicle carrier"),
    COMB("Combination carrier"),
    ROPAX("Ro-pax ship"),
    CONT_RORO("Container/ro-ro cargo ship"),
    CRUISE("Cruise passenger ship"),
    OFFSHORE("Offshore support vessel"),
    OTHER("Other ship types");

    private final String description;
}
