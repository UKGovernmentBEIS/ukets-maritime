package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpSaveApplicationAmendRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpSaveApplicationAmendActionHandlerTest {

    @InjectMocks
    private EmpNotificationFollowUpSaveApplicationAmendActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {

        final UUID file = UUID.randomUUID();
        final EmpNotificationFollowUpSaveApplicationAmendRequestTaskActionPayload taskActionPayload =
            EmpNotificationFollowUpSaveApplicationAmendRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_FOLLOW_UP_SAVE_APPLICATION_AMEND_PAYLOAD)
                .response("the response")
                .files(Set.of(file))
                .sectionsCompleted(Map.of("section1", "accepted"))
                .build();
        final EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload expectedRequestTaskPayload =
            mock(EmpNotificationFollowUpApplicationAmendsSubmitRequestTaskPayload.class);
        final AppUser appUser = AppUser.builder().build();
        final String processTaskId = "processTaskId";
        final RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .processTaskId(processTaskId)
            .payload(expectedRequestTaskPayload)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SAVE_APPLICATION_AMEND,
            appUser,
            taskActionPayload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verify(expectedRequestTaskPayload).setFollowUpResponse(taskActionPayload.getResponse());
        verify(expectedRequestTaskPayload).setFollowUpFiles(taskActionPayload.getFiles());
        verify(expectedRequestTaskPayload).setSectionsCompleted(taskActionPayload.getSectionsCompleted());
        verifyNoMoreInteractions(expectedRequestTaskPayload);

        verify(requestTaskService, times(1)).findTaskById(requestTask.getId());
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes())
            .containsExactly(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SAVE_APPLICATION_AMEND);
    }
}