package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AerSectionsCompleted {
    EMISSIONS("emissions"),
    SHIP_EMISSIONS("emissions-ship-"),
    AGGREGATED_DATA("aggregatedData"),
    SHIP_AGGREGATED_DATA("aggregatedData-aggregated-data-"),
    REPORTING_OBLIGATION("reportingObligation"),
    SMF("smf");

    private final String key;
}
