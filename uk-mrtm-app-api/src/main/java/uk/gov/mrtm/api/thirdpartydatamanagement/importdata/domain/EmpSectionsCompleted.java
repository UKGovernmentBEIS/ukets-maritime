package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EmpSectionsCompleted {
    SHIP_EMISSIONS("emissions-"),
    CONTROL_ACTIVITIES("controlActivities"),
    DATA_GAPS("dataGaps"),
    EMISSIONS("emissions"),
    GREENHOUSE_GAS("greenhouseGas"),
    MANAGEMENT_PROCEDURES("managementProcedures"),
    MANDATE("mandate"),
    SOURCES("sources");

    private final String key;
}
