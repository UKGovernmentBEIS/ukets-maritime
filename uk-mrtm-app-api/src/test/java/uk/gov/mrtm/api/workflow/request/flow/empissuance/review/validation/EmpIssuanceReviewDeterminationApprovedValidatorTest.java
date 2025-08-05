package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps.EmpDataGaps;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceReviewDeterminationApprovedValidatorTest {


    private final EmpIssuanceReviewDeterminationApprovedValidator validator = new EmpIssuanceReviewDeterminationApprovedValidator();

    @Test
    void isValid_true_when_all_mandatory_review_groups_accepted() {
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
        createAcceptedReviewGroupDecisions(reviewGroupDecisions, List.of(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
            EmpReviewGroup.SHIPS_CALCULATION_EMISSIONS,
            EmpReviewGroup.MONITORING_APPROACH,
            EmpReviewGroup.EMISSION_SOURCES,
            EmpReviewGroup.MANAGEMENT_PROCEDURES,
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
            EmpReviewGroup.ADDITIONAL_DOCUMENTS,
            EmpReviewGroup.CONTROL_ACTIVITIES,
            EmpReviewGroup.DATA_GAPS));

        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload =
            EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .reviewGroupDecisions(reviewGroupDecisions)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().build())
                .build();

        assertTrue(validator.isValid(requestTaskPayload));
    }

    @Test
    void isValid_false_when_not_all_mandatory_review_groups_accepted() {
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
        createAcceptedReviewGroupDecisions(reviewGroupDecisions, List.of(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
            EmpReviewGroup.SHIPS_CALCULATION_EMISSIONS,
            EmpReviewGroup.MONITORING_APPROACH,
            EmpReviewGroup.EMISSION_SOURCES,
            EmpReviewGroup.MANAGEMENT_PROCEDURES,
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
            EmpReviewGroup.ADDITIONAL_DOCUMENTS));

        reviewGroupDecisions.put(EmpReviewGroup.DATA_GAPS, buildAmendsNeededReviewDecision());

        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload =
            EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .reviewGroupDecisions(reviewGroupDecisions)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().build())
                .build();

        assertFalse(validator.isValid(requestTaskPayload));
    }

    @Test
    void isValid_false_when_not_all_mandatory_review_groups_have_decision() {
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
        createAcceptedReviewGroupDecisions(reviewGroupDecisions, List.of(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
            EmpReviewGroup.SHIPS_CALCULATION_EMISSIONS,
            EmpReviewGroup.MONITORING_APPROACH,
            EmpReviewGroup.EMISSION_SOURCES,
            EmpReviewGroup.MANAGEMENT_PROCEDURES,
            EmpReviewGroup.ADDITIONAL_DOCUMENTS,
            EmpReviewGroup.DATA_GAPS));

        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload =
            EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .reviewGroupDecisions(reviewGroupDecisions)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().build())
                .build();

        assertFalse(validator.isValid(requestTaskPayload));
    }

    @Test
    void isValid_true_when_all_required_review_groups_have_decision() {
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
        createAcceptedReviewGroupDecisions(reviewGroupDecisions, List.of(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
            EmpReviewGroup.SHIPS_CALCULATION_EMISSIONS,
            EmpReviewGroup.MONITORING_APPROACH,
            EmpReviewGroup.EMISSION_SOURCES,
            EmpReviewGroup.MANAGEMENT_PROCEDURES,
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
            EmpReviewGroup.ADDITIONAL_DOCUMENTS,
            EmpReviewGroup.CONTROL_ACTIVITIES,
            EmpReviewGroup.DATA_GAPS));

        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload =
            EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .reviewGroupDecisions(reviewGroupDecisions)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                    .dataGaps(EmpDataGaps.builder().build())
                    .build())
                .build();

        assertTrue(validator.isValid(requestTaskPayload));
    }

    @Test
    void getType() {
        assertEquals(EmpIssuanceDeterminationType.APPROVED, validator.getType());
    }

    private EmpIssuanceReviewDecision buildAcceptedReviewDecision() {
        return EmpIssuanceReviewDecision.builder()
            .type(EmpReviewDecisionType.ACCEPTED)
            .details(ReviewDecisionDetails.builder().notes("notes").build())
            .build();
    }

    private EmpIssuanceReviewDecision buildAmendsNeededReviewDecision() {
        return EmpIssuanceReviewDecision.builder()
            .type(EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            .details(ChangesRequiredDecisionDetails.builder().notes("notes").build())
            .build();
    }

    private void createAcceptedReviewGroupDecisions(
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions, List<EmpReviewGroup> groupList) {
        groupList.forEach(group -> reviewGroupDecisions.put(group, buildAcceptedReviewDecision()));
    }
}