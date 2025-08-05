package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceReviewRequestActionMapperTest {

    private final EmpIssuanceReviewRequestActionMapper requestActionMapper = Mappers.getMapper(EmpIssuanceReviewRequestActionMapper.class);

    @Test
    void cloneApprovedPayloadIgnoreReasonAndDecisions() {
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder().build();
        EmpIssuanceDetermination determination = EmpIssuanceDetermination.builder()
            .type(EmpIssuanceDeterminationType.APPROVED)
            .reason("reason")
            .build();
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = Map.of(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
        );
        EmpIssuanceApplicationApprovedRequestActionPayload empIssuanceApplicationApprovedRequestActionPayload =
            EmpIssuanceApplicationApprovedRequestActionPayload.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .determination(determination)
                .reviewGroupDecisions(reviewGroupDecisions)
                .empDocument(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("emp document name").build())
                .officialNotice(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("approved official notice name").build())
                .build();

        EmpIssuanceApplicationApprovedRequestActionPayload clonedRequestActionPayload =
            requestActionMapper.cloneApprovedPayloadIgnoreReasonAndDecisions(empIssuanceApplicationApprovedRequestActionPayload);

        assertEquals(emissionsMonitoringPlan, clonedRequestActionPayload.getEmissionsMonitoringPlan());
        assertThat(clonedRequestActionPayload.getReviewGroupDecisions()).isEmpty();

        EmpIssuanceDetermination clonedRequestActionPayloadDetermination = clonedRequestActionPayload.getDetermination();
        assertEquals(determination.getType(), clonedRequestActionPayloadDetermination.getType());
        assertNull(clonedRequestActionPayloadDetermination.getReason());
    }

    @Test
    void cloneDeemedWithdrawnPayloadIgnoreReason() {
        EmpIssuanceDetermination determination = EmpIssuanceDetermination.builder()
            .type(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN)
            .reason("reason")
            .build();
        DecisionNotification decisionNotification = DecisionNotification.builder()
            .operators(Set.of("operatorUser"))
            .signatory("regulatorUser")
            .build();
        EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload empIssuanceApplicationDeemedWithdrawnRequestActionPayload =
            EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload.builder()
                .determination(determination)
                .decisionNotification(decisionNotification)
                .officialNotice(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("approved official notice name").build())
                .build();

        EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload clonedRequestActionPayload =
            requestActionMapper.cloneDeemedWithdrawnPayloadIgnoreReason(empIssuanceApplicationDeemedWithdrawnRequestActionPayload);

        assertEquals(decisionNotification, clonedRequestActionPayload.getDecisionNotification());

        EmpIssuanceDetermination clonedRequestActionPayloadDetermination = clonedRequestActionPayload.getDetermination();
        assertEquals(determination.getType(), clonedRequestActionPayloadDetermination.getType());
        assertNull(clonedRequestActionPayloadDetermination.getReason());
    }
}