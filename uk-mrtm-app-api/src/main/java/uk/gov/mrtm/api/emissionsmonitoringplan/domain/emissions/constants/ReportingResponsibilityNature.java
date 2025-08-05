package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReportingResponsibilityNature {
    SHIPOWNER("Registered owner"),
    ISM_COMPANY("ISM Company");

    private final String description;
}
