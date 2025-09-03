package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain;

import java.util.Set;

public enum EmpReviewGroup {

    MARITIME_OPERATOR_DETAILS,
    SHIPS_CALCULATION_EMISSIONS,
    MONITORING_APPROACH,
    EMISSION_SOURCES,
    MANAGEMENT_PROCEDURES,
    ABBREVIATIONS_AND_DEFINITIONS,
    ADDITIONAL_DOCUMENTS,
    DATA_GAPS,
    CONTROL_ACTIVITIES,
    MANDATE
    ;

    public static Set<EmpReviewGroup> getStandardReviewGroups() {
        return Set.of(
                EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
                EmpReviewGroup.SHIPS_CALCULATION_EMISSIONS,
                EmpReviewGroup.MONITORING_APPROACH,
                EmpReviewGroup.EMISSION_SOURCES,
                EmpReviewGroup.MANAGEMENT_PROCEDURES,
                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
                EmpReviewGroup.ADDITIONAL_DOCUMENTS,
                EmpReviewGroup.DATA_GAPS,
                EmpReviewGroup.CONTROL_ACTIVITIES,
                EmpReviewGroup.MANDATE
        );
    }
}
