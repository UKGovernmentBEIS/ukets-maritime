package uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(MockitoExtension.class)
class EmpNotificationApplicationGrantedCustomMapperTest {
    @InjectMocks
    private EmpNotificationApplicationGrantedCustomMapper mapper;

    @Test
    void toRequestActionDTO() {

        EmpNotificationAcceptedDecisionDetails empNotificationAcceptedDecisionDetails = EmpNotificationAcceptedDecisionDetails.builder()
                .notes("the notes")
                .followUp(FollowUp.builder()
                        .followUpRequest("followUpRequest")
                        .followUpResponseExpirationDate(LocalDate.now())
                        .followUpResponseRequired(true)
                        .build())
                .officialNotice("officialNotice")
                .build();
        final RequestAction requestAction = RequestAction.builder()
                .request(Request.builder().id("id").build())
                .type(MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_GRANTED)
                .payload(EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_GRANTED_PAYLOAD)
                        .reviewDecision(EmpNotificationReviewDecision.builder()
                                .type(EmpNotificationReviewDecisionType.ACCEPTED)
                                .details(empNotificationAcceptedDecisionDetails)
                                .build())
                        .officialNotice(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("name").build())
                        .build())
                .build();

        final RequestActionDTO result = mapper.toRequestActionDTO(requestAction);

        assertThat(result.getType()).isEqualTo(requestAction.getType());
        final EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload resultPayload =
                (EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getReviewDecision().getDetails().getNotes()).isNull();
        assertEquals(empNotificationAcceptedDecisionDetails.getFollowUp(),
                ((EmpNotificationAcceptedDecisionDetails)resultPayload.getReviewDecision().getDetails()).getFollowUp());
        assertEquals(empNotificationAcceptedDecisionDetails.getOfficialNotice(),
                ((EmpNotificationAcceptedDecisionDetails)resultPayload.getReviewDecision().getDetails()).getOfficialNotice());
        assertNull(resultPayload.getReviewDecision().getDetails().getNotes());

    }

    @Test
    void getRequestActionType() {
        assertThat(mapper.getRequestActionType()).isEqualTo(MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_GRANTED);
    }

    @Test
    void getUserRoleTypes() {
        assertThat(mapper.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }

}