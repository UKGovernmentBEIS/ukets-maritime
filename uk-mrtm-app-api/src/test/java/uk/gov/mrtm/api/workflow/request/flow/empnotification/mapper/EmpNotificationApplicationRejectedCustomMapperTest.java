package uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionDetails;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpNotificationApplicationRejectedCustomMapperTest {

    @InjectMocks
    private EmpNotificationApplicationRejectedCustomMapper mapper;

    @Test
    void toRequestActionDTO() {

        EmpNotificationReviewDecisionDetails reviewDecisionDetails = EmpNotificationReviewDecisionDetails.builder()
                .notes("the notes")
                .officialNotice("officialNotice")
                .build();
        final RequestAction requestAction = RequestAction.builder()
                .request(Request.builder()
                        .id("requestId")
                        .build())
                .type(MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_REJECTED)
                .payload(EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_REJECTED_PAYLOAD)
                        .reviewDecision(EmpNotificationReviewDecision.builder()
                                .details(reviewDecisionDetails)
                                .build())
                        .officialNotice(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("name").build())
                        .build())
                .build();

        final RequestActionDTO result = mapper.toRequestActionDTO(requestAction);

        assertThat(result.getType()).isEqualTo(requestAction.getType());
        final EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload resultPayload =
                (EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getReviewDecision().getDetails().getNotes()).isNull();
        assertEquals(reviewDecisionDetails.getOfficialNotice(), ((EmpNotificationReviewDecisionDetails) resultPayload.getReviewDecision().getDetails()).getOfficialNotice());
    }

    @Test
    void getRequestActionType() {
        assertThat(mapper.getRequestActionType()).isEqualTo(MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_REJECTED);
    }

    @Test
    void getUserRoleTypes() {
        assertThat(mapper.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
}
