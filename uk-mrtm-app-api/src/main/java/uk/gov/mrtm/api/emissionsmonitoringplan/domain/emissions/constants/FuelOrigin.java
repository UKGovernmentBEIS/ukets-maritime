package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FuelOrigin {
    FOSSIL("Fossil fuels"),
    BIOFUEL("Biofuels"),
    RFNBO("RFNBO e-fuels");

    private final String description;
}
