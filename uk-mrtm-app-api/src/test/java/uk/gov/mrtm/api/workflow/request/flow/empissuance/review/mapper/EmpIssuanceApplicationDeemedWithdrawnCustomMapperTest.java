package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceApplicationDeemedWithdrawnCustomMapperTest {

    @InjectMocks
    private EmpIssuanceApplicationDeemedWithdrawnCustomMapper cut;


    @Test
    void toRequestActionDTO() {
        RequestAction requestAction = RequestAction.builder()
            .type(MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_APPROVED)
            .request(Request.builder().build())
            .payload(EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload.builder()
                .determination(EmpIssuanceDetermination.builder()
                    .reason("reason")
                    .type(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN)
                    .build())
                .decisionNotification(DecisionNotification.builder()
                    .signatory("sign")
                    .build())
                .officialNotice(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("offnotice").build())
                .build())
            .build();

        RequestActionDTO result = cut.toRequestActionDTO(requestAction);

        assertThat(result).isNotNull();
        assertThat(result.getType()).isEqualTo(requestAction.getType());
        assertThat(result.getPayload()).isInstanceOf(EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload.class);

        EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload resultPayload = (EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getDetermination().getReason()).isNull();
        assertThat(resultPayload.getDetermination().getType()).isEqualTo(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN);
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