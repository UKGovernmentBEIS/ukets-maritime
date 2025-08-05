package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationApprovedRequestActionPayload;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceApplicationApprovedCustomMapperTest {

    @InjectMocks
    private EmpIssuanceApplicationApprovedCustomMapper cut;

    @Test
    void toRequestActionDTO() {
        RequestAction requestAction = RequestAction.builder()
            .type(MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_APPROVED)
            .request(Request.builder().build())
            .payload(EmpIssuanceApplicationApprovedRequestActionPayload.builder()
                .determination(EmpIssuanceDetermination.builder()
                    .reason("reason")
                    .type(EmpIssuanceDeterminationType.APPROVED)
                    .build())
                .decisionNotification(DecisionNotification.builder()
                    .signatory("sign")
                    .build())
                .empDocument(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("emp").build())
                .officialNotice(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("offnotice").build())
                .build())
            .build();

        RequestActionDTO result = cut.toRequestActionDTO(requestAction);

        assertThat(result).isNotNull();
        assertThat(result.getType()).isEqualTo(requestAction.getType());
        assertThat(result.getPayload()).isInstanceOf(EmpIssuanceApplicationApprovedRequestActionPayload.class);

        EmpIssuanceApplicationApprovedRequestActionPayload resultPayload = (EmpIssuanceApplicationApprovedRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getReviewGroupDecisions()).isEmpty();
        assertThat(resultPayload.getDetermination().getReason()).isNull();
        assertThat(resultPayload.getDetermination().getType()).isEqualTo(EmpIssuanceDeterminationType.APPROVED);
    }

    @Test
    void getUserRoleTypes() {
        assertThat(cut.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }

    @Test
    void getRequestActionType() {
        assertThat(cut.getRequestActionType()).isEqualTo(MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_APPROVED);
    }

}