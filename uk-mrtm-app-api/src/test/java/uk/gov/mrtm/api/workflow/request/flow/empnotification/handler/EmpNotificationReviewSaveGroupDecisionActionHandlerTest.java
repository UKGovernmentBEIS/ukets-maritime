package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.RequestEmpNotificationReviewService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationReviewSaveGroupDecisionActionHandlerTest {

    @InjectMocks
    private EmpNotificationReviewSaveGroupDecisionActionHandler handler;

    @Mock
    private RequestEmpNotificationReviewService requestEmpNotificationReviewService;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {
        final Long requestTaskId = 1L;
        final String requestTaskActionType = MrtmRequestTaskActionType.EMP_NOTIFICATION_SAVE_REVIEW_GROUP_DECISION;
        final AppUser appUser = AppUser.builder().userId("user").build();
        final RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        final EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload payload = EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload.builder()
            .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_SAVE_REVIEW_GROUP_DECISION_PAYLOAD)
            .reviewDecision(EmpNotificationReviewDecision.builder()
                .type(EmpNotificationReviewDecisionType.ACCEPTED)
                .details(
                    EmpNotificationAcceptedDecisionDetails.builder()
                        .notes("notes")
                        .officialNotice("officialNotice")
                        .followUp(FollowUp.builder()
                            .followUpResponseRequired(false)
                            .build())
                        .build()
                )
                .build())
            .build();

        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .payload(expectedRequestTaskPayload)
            .processTaskId("processTaskId")
            .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTaskId, requestTaskActionType, appUser, payload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(requestTaskService, times(1)).findTaskById(requestTask.getId());
        verify(requestEmpNotificationReviewService, times(1)).saveReviewDecision(payload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes())
            .containsExactly(MrtmRequestTaskActionType.EMP_NOTIFICATION_SAVE_REVIEW_GROUP_DECISION);
    }
}
