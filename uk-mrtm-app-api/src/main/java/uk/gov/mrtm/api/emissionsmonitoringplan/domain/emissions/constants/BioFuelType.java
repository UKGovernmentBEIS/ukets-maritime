package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BioFuelType {
    ETHANOL("Ethanol"),
    BIO_DIESEL("Bio-diesel"),
    HVO("Hydro Treated Vegetable Oil (HVO)"),
    BIO_LNG("Liquified bio-methane as transport fuel (Bio-LNG)"),
    BIO_METHANOL("Bio-methanol"),
    BIO_H2("Bio-H2"),
    OTHER("Other");

    private final String description;
}
