package uk.gov.mrtm.api.integration.registry.regulatornotice.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MrtmRegulatorNoticeNotificationType {
    ACCOUNT_CLOSED("Account closed"),
    EMP_WITHDRAWN("EMP Withdrawn");

    private final String description;
}
