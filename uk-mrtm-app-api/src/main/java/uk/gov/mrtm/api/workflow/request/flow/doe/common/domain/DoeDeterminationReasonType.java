package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DoeDeterminationReasonType {

    VERIFIED_REPORT_NOT_SUBMITTED_IN_ACCORDANCE_WITH_ORDER,
    CORRECTING_NON_MATERIAL_MISSTATEMENT,
    IMPOSING_OR_CONSIDERING_IMPOSING_CIVIL_PENALTY_IN_ACCORDANCE_WITH_ORDER
}
