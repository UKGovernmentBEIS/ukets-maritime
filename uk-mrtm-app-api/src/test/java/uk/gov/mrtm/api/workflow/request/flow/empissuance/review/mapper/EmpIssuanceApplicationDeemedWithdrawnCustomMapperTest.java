package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceApplicationDeemedWithdrawnCustomMapperTest {

    @InjectMocks
    private EmpIssuanceApplicationDeemedWithdrawnCustomMapper cut;


    @Test
    void toRequestActionDTO() {
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder().build();
        RequestAction requestAction = RequestAction.builder()
            .type(MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_DEEMED_WITHDRAWN)
            .request(Request.builder().build())
            .payload(EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .determination(EmpIssuanceDetermination.builder()
                    .reason("reason")
                    .type(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN)
                    .build())
                .decisionNotification(DecisionNotification.builder()
                    .signatory("sign")
                    .build())
                .reviewGroupDecisions(Map.of(
                    EmpReviewGroup.MARITIME_OPERATOR_DETAILS, EmpIssuanceReviewDecision.builder()
                        .type(EmpReviewDecisionType.ACCEPTED)
                        .details(ReviewDecisionDetails.builder().notes("notes").build())
                        .build()
                ))
                .officialNotice(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("offnotice").build())
                .build())
            .build();

        RequestActionDTO result = cut.toRequestActionDTO(requestAction);

        assertThat(result).isNotNull();
        assertThat(result.getType()).isEqualTo(requestAction.getType());
        assertThat(result.getPayload()).isInstanceOf(EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload.class);

        EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload resultPayload =
            (EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getEmissionsMonitoringPlan()).isEqualTo(emissionsMonitoringPlan);
        assertThat(resultPayload.getDetermination().getReason()).isNull();
        assertThat(resultPayload.getDetermination().getType()).isEqualTo(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN);
        assertThat(resultPayload.getReviewGroupDecisions()).isEmpty();
    }

    @Test
    void getUserRoleTypes() {
        assertThat(cut.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }

    @Test
    void getRequestActionType() {
        assertThat(cut.getRequestActionType()).isEqualTo(MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_DEEMED_WITHDRAWN);
    }
}
