package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpExtendDateRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationSendEventService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpExtendDateActionHandlerTest {

    @InjectMocks
    private EmpNotificationFollowUpExtendDateActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpNotificationSendEventService eventService;

    @Test
    void process() {

        final LocalDate dueDate = LocalDate.of(2023, 1, 1);
        final EmpNotificationFollowUpExtendDateRequestTaskActionPayload taskActionPayload =
                EmpNotificationFollowUpExtendDateRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_FOLLOW_UP_EXTEND_DATE_PAYLOAD)
                        .dueDate(dueDate)
                        .build();
        final AppUser appUser = AppUser.builder().build();
        final RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        final RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .payload(expectedRequestTaskPayload)
            .dueDate(LocalDate.of(2022, 12, 1))
            .request(Request.builder().id("requestId").build())
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload =
            handler.process(requestTask.getId(), MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_EXTEND_DATE,
                appUser, taskActionPayload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(requestTaskService, times(1)).findTaskById(requestTask.getId());
        verify(eventService, times(1)).extendTimer("requestId", dueDate);
    }

    @Test
    void process_invalid_due_date() {

        final LocalDate dueDate = LocalDate.of(2023, 1, 1);
        final EmpNotificationFollowUpExtendDateRequestTaskActionPayload taskActionPayload =
                EmpNotificationFollowUpExtendDateRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_FOLLOW_UP_EXTEND_DATE_PAYLOAD)
                        .dueDate(dueDate)
                        .build();
        final AppUser appUser = AppUser.builder().build();
        final RequestTask requestTask =
                RequestTask.builder()
                        .id(1L)
                        .dueDate(LocalDate.of(2023, 12, 1))
                        .request(Request.builder().id("requestId").build())
                        .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);
        final Long requestTaskId = requestTask.getId();

        // Invoke
        BusinessException be = assertThrows(BusinessException.class,
            () ->handler.process(requestTaskId, MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_EXTEND_DATE,
                appUser, taskActionPayload));

        // Verify
        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.FORM_VALIDATION);

        verify(requestTaskService).findTaskById(1L);
        verifyNoInteractions(eventService);
        verifyNoMoreInteractions(requestTaskService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_EXTEND_DATE);
    }
    
}
