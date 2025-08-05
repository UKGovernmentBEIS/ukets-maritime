package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EFuelType {
    E_DIESEL("e-diesel"),
    E_METHANOL("e-methanol"),
    E_LNG("e-LNG"),
    E_H2("e-H2"),
    E_NH3("e-NH3"),
    E_LPG("e-LPG"),
    E_DME("e-DME"),
    OTHER("Other");

    private final String description;
}
