package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MethodApproach {

    DEFAULT("Default"),
    SHIP_SPECIFIC("Ship specific")
    ;

    private final String description;
}
