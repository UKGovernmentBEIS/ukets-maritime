package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
public class EmpVariationReviewReturnForAmendsValidatorServiceTest {

    @InjectMocks
    private EmpVariationReviewReturnForAmendsValidatorService validator;

    @Test
    void validate_review_group_amends() {
        UUID uuid = UUID.randomUUID();
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
        reviewGroupDecisions.put(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.REJECTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build());
        reviewGroupDecisions.put(EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder().requiredChanges(List.of(
                        ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(uuid)).build())).build())
                .build());

        EmpVariationApplicationReviewRequestTaskPayload payload = EmpVariationApplicationReviewRequestTaskPayload.builder()
                .emissionsMonitoringPlan(buildEmp())
                .reviewGroupDecisions(reviewGroupDecisions)
                .build();

        // Invoke
        assertDoesNotThrow(() -> validator.validate(payload));
    }

    @Test
    void validate_variation_details_amends() {
        EmpVariationApplicationReviewRequestTaskPayload payload = EmpVariationApplicationReviewRequestTaskPayload.builder()
                .emissionsMonitoringPlan(buildEmp())
                .empVariationDetailsReviewDecision(EmpVariationReviewDecision.builder()
                        .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                        .details(ChangesRequiredDecisionDetails.builder().requiredChanges(List.of(
                                ReviewDecisionRequiredChange.builder().reason("reason").build())).build()).build())
                .build();

        // Invoke
        assertDoesNotThrow(() -> validator.validate(payload));
    }

    @Test
    void validate_no_amends() {
        UUID uuid = UUID.randomUUID();
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
        reviewGroupDecisions.put(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.REJECTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build());
        reviewGroupDecisions.put(EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.ACCEPTED)
                .details(ChangesRequiredDecisionDetails.builder().requiredChanges(List.of(
                        ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(uuid)).build())).build())
                .build());

        EmpVariationApplicationReviewRequestTaskPayload payload = EmpVariationApplicationReviewRequestTaskPayload.builder()
                .emissionsMonitoringPlan(buildEmp())
                .reviewGroupDecisions(reviewGroupDecisions)
                .build();

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class, () -> validator.validate(payload));

        // Verify
        assertThat(ex.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_EMP_VARIATION_REVIEW);
    }

    private EmissionsMonitoringPlan buildEmp() {
        return EmissionsMonitoringPlan.builder()
                .operatorDetails(EmpOperatorDetails.builder()
                        .operatorName("name")
                        .build())
                .abbreviations(EmpAbbreviations.builder().exist(false).build())
                .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                .build();
    }
}
