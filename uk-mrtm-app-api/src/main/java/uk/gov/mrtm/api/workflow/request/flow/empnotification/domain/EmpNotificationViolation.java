package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import lombok.Getter;

@Getter
public enum EmpNotificationViolation {

    ATTACHMENT_NOT_FOUND("Attachment not found"),
    ATTACHMENT_NOT_REFERENCED("Attachment is not referenced in EMP notification");

    private final String message;

    EmpNotificationViolation(String message) {
        this.message = message;
    }
    
}
