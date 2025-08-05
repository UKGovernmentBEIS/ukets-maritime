package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import java.util.HashSet;
import java.util.Set;

public enum AerReviewGroup {

    //AER related
    OPERATOR_DETAILS,
    MONITORING_PLAN_CHANGES,

    LIST_OF_SHIPS,
    VOYAGES,

    PORTS,
    AGGREGATED_EMISSIONS_DATA,
    ADDITIONAL_DOCUMENTS,
    EMISSIONS_REDUCTION_CLAIM,
    TOTAL_EMISSIONS,

    REPORTING_OBLIGATION_DETAILS,

    //verification report related
    VERIFIER_DETAILS,
    OPINION_STATEMENT,
    ETS_COMPLIANCE_RULES,
    COMPLIANCE_MONITORING_REPORTING,
    OVERALL_DECISION,
    UNCORRECTED_MISSTATEMENTS,
    UNCORRECTED_NON_CONFORMITIES,
    UNCORRECTED_NON_COMPLIANCES,
    RECOMMENDED_IMPROVEMENTS,
    CLOSE_DATA_GAPS_METHODOLOGIES,
    MATERIALITY_LEVEL,
    ;

    public static Set<AerReviewGroup> getVerificationReportDataReviewGroups() {
        return Set.of(
                VERIFIER_DETAILS,
                OPINION_STATEMENT,
                ETS_COMPLIANCE_RULES,
                COMPLIANCE_MONITORING_REPORTING,
                OVERALL_DECISION,
                UNCORRECTED_MISSTATEMENTS,
                UNCORRECTED_NON_CONFORMITIES,
                UNCORRECTED_NON_COMPLIANCES,
                RECOMMENDED_IMPROVEMENTS,
                CLOSE_DATA_GAPS_METHODOLOGIES,
                MATERIALITY_LEVEL
        );
    }

    public static Set<AerReviewGroup> getAerDataReviewGroups(boolean isReportingRequired, boolean hasPorts, boolean hasVoyages) {
        Set<AerReviewGroup> aerReviewGroups = new HashSet<>();

        if (isReportingRequired) {
            aerReviewGroups.add(OPERATOR_DETAILS);
            aerReviewGroups.add(MONITORING_PLAN_CHANGES);
            aerReviewGroups.add(LIST_OF_SHIPS);
            aerReviewGroups.add(AGGREGATED_EMISSIONS_DATA);
            aerReviewGroups.add(EMISSIONS_REDUCTION_CLAIM);
            aerReviewGroups.add(TOTAL_EMISSIONS);
            aerReviewGroups.add(ADDITIONAL_DOCUMENTS);

            if (hasPorts) {
                aerReviewGroups.add(PORTS);
            }
            if (hasVoyages) {
                aerReviewGroups.add(VOYAGES);
            }
        } else {
            aerReviewGroups.add(REPORTING_OBLIGATION_DETAILS);
        }

        return aerReviewGroups;
    }
}
