package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSaveRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.RequestEmpNotificationService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationApplicationApplySaveActionHandlerTest {

    @InjectMocks
    private EmpNotificationApplicationApplySaveActionHandler handler;

    @Mock
    private RequestEmpNotificationService service;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {
        EmpNotificationApplicationSaveRequestTaskActionPayload actionPayload =
            mock(EmpNotificationApplicationSaveRequestTaskActionPayload.class);

        RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        RequestTask requestTask = RequestTask.builder().id(1L).payload(expectedRequestTaskPayload).build();
        AppUser appUser = AppUser.builder().build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_SAVE_APPLICATION, appUser, actionPayload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(service).applySavePayload(actionPayload, requestTask);
        verifyNoMoreInteractions(service, requestTaskService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).isEqualTo(List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_SAVE_APPLICATION));
    }
}
