package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ThirdPartyDataManagementImportResult {

    SUCCESS("Completed", "N/A"),
    SCHEDULED("Failed", "Job is scheduled for import"),
    STAGING_DATA_ALREADY_IMPORTED("Failed", "Data has already been imported for this task"),
    REQUEST_TASK_NOT_FOUND("Failed", "The task is not available for data to be imported"),
    USER_NOT_ASSIGNED_TO_ACCOUNT("Failed", "The requestor is not assigned to the account"),
    REPORTING_NOT_REQUIRED("Failed", "Report not required"),
    GENERIC_ERROR("Failed", "There is an unknown error");

    private final String categoryShortDescription;
    private final String failureReason;
}
