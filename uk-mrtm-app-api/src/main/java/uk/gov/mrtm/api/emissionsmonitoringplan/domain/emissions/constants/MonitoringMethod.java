package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MonitoringMethod {
    BDN("Method A"),
    BUNKER_TANK("Method B"),
    FLOW_METERS("Method C"),
    DIRECT("Method D")
    ;

    private final String description;
}
