package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ThirdPartyDataManagementAvailableToImportSortField {
    OPERATOR_NAME("name"),
    TASK("request_task_type_desc"),
    RECEIVED_ON("received_on");

    private final String column;
}
