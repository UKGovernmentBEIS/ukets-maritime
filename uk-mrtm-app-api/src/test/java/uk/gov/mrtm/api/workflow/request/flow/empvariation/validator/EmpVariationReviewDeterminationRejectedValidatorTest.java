package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import org.junit.jupiter.api.Test;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps.EmpDataGaps;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.EnumMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EmpVariationReviewDeterminationRejectedValidatorTest {

    private final EmpVariationReviewDeterminationRejectedValidator validator = new EmpVariationReviewDeterminationRejectedValidator();

    @Test
    void isValid_true_when_all_mandatory_review_groups_accepted_one_rejected() {
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = buildAcceptedDecisions();

        EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder()
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .empVariationDetailsReviewDecision(buildRejectedReviewDecision())
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().build())
                        .build();

        assertTrue(validator.isValid(requestTaskPayload));
    }

    @Test
    void isValid_false_when_all_mandatory_review_groups_accepted() {
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = buildAcceptedDecisions();

        EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder()
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .empVariationDetailsReviewDecision(buildAcceptedReviewDecision())
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().build())
                        .build();

        assertFalse(validator.isValid(requestTaskPayload));
    }

    @Test
    void isValid_false_when_not_all_mandatory_review_groups_have_decision() {
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = buildAcceptedDecisions();

        EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder()
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().build())
                        .build();

        assertFalse(validator.isValid(requestTaskPayload));
    }

    @Test
    void isValid_true_when_required_review_group_rejected() {
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = buildAcceptedDecisions();

        reviewGroupDecisions.put(EmpReviewGroup.DATA_GAPS, buildRejectedReviewDecision());

        EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder()
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .empVariationDetailsReviewDecision(buildAcceptedReviewDecision())
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                                .dataGaps(EmpDataGaps.builder().build())
                                .build())
                        .build();

        assertTrue(validator.isValid(requestTaskPayload));
    }

    @Test
    void isValid_false_when_one_decision_is_amends_needed() {
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = buildAcceptedDecisions();

        reviewGroupDecisions.put(EmpReviewGroup.DATA_GAPS, buildRejectedReviewDecision());

        EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder()
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .empVariationDetailsReviewDecision(buildAmendsNeededReviewDecision())
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                                .dataGaps(EmpDataGaps.builder().build())
                                .build())
                        .build();

        assertFalse(validator.isValid(requestTaskPayload));
    }

    @Test
    void getType() {
        assertEquals(EmpVariationDeterminationType.REJECTED, validator.getType());
    }

    private Map<EmpReviewGroup, EmpVariationReviewDecision> buildAcceptedDecisions() {
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
        reviewGroupDecisions.put(EmpReviewGroup.MARITIME_OPERATOR_DETAILS, buildAcceptedReviewDecision());
        reviewGroupDecisions.put(EmpReviewGroup.SHIPS_CALCULATION_EMISSIONS, buildAcceptedReviewDecision());
        reviewGroupDecisions.put(EmpReviewGroup.MONITORING_APPROACH, buildAcceptedReviewDecision());
        reviewGroupDecisions.put(EmpReviewGroup.EMISSION_SOURCES, buildAcceptedReviewDecision());
        reviewGroupDecisions.put(EmpReviewGroup.MANAGEMENT_PROCEDURES, buildAcceptedReviewDecision());
        reviewGroupDecisions.put(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, buildAcceptedReviewDecision());
        reviewGroupDecisions.put(EmpReviewGroup.ADDITIONAL_DOCUMENTS, buildAcceptedReviewDecision());
        reviewGroupDecisions.put(EmpReviewGroup.DATA_GAPS, buildAcceptedReviewDecision());
        reviewGroupDecisions.put(EmpReviewGroup.CONTROL_ACTIVITIES, buildAcceptedReviewDecision());
        return reviewGroupDecisions;
    }

    private EmpVariationReviewDecision buildRejectedReviewDecision() {
        return EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.REJECTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();
    }

    private EmpVariationReviewDecision buildAmendsNeededReviewDecision() {
        return EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder().notes("notes").build())
                .build();
    }

    private EmpVariationReviewDecision buildAcceptedReviewDecision() {
        return EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.ACCEPTED)
                .details(ChangesRequiredDecisionDetails.builder().notes("notes").build())
                .build();
    }
}
