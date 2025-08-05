package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.EmissionsMonitoringPlanFactory;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceReviewReturnForAmendsValidatorServiceTest {

    @InjectMocks
    private EmpIssuanceReviewReturnForAmendsValidatorService serviceValidator;

    @Test
    void validate() {
        EmpIssuanceApplicationReviewRequestTaskPayload payload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .emissionsMonitoringPlan(EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(UUID.randomUUID(), "1231231"))
            .reviewGroupDecisions(Map.of(
                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, buildReviewDecision(EmpReviewDecisionType.ACCEPTED),
                EmpReviewGroup.EMISSION_SOURCES, buildReviewDecision(EmpReviewDecisionType.ACCEPTED),
                EmpReviewGroup.MANAGEMENT_PROCEDURES, buildReviewDecision(EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            ))
            .build();

        // Invoke/ Verify
        assertDoesNotThrow(() -> serviceValidator.validate(payload));
    }

    @Test
    void validate_no_amends() {
        EmpIssuanceApplicationReviewRequestTaskPayload payload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .emissionsMonitoringPlan(EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(UUID.randomUUID(), "1231231"))
            .reviewGroupDecisions(Map.of(
                EmpReviewGroup.ADDITIONAL_DOCUMENTS, buildReviewDecision(EmpReviewDecisionType.ACCEPTED),
                EmpReviewGroup.CONTROL_ACTIVITIES, buildReviewDecision(EmpReviewDecisionType.ACCEPTED),
                EmpReviewGroup.MARITIME_OPERATOR_DETAILS, buildReviewDecision(EmpReviewDecisionType.ACCEPTED)
            ))
            .build();

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class, () -> serviceValidator.validate(payload));

        // Verify
        assertThat(ex.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_EMP_REVIEW);
    }

    private EmpIssuanceReviewDecision buildReviewDecision(EmpReviewDecisionType type) {
        return EmpIssuanceReviewDecision.builder().type(type).build();
    }

}
