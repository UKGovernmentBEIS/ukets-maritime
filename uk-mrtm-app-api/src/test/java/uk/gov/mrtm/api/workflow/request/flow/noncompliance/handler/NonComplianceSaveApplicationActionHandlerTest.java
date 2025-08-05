package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceSaveApplicationActionHandlerTest {

    @InjectMocks
    private NonComplianceSaveApplicationActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NonComplianceApplyService applyService;

    @Test
    void process() {

        final long requestTaskId = 1L;
        RequestTaskPayload requestTaskPayload = mock(RequestTaskPayload.class);
        final RequestTask requestTask = RequestTask.builder().id(requestTaskId).payload(requestTaskPayload).build();
        final NonComplianceSaveApplicationRequestTaskActionPayload taskActionPayload =
            mock(NonComplianceSaveApplicationRequestTaskActionPayload.class);
        final AppUser appUser = AppUser.builder().build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        RequestTaskPayload actualRequestTaskPayload = handler.process(requestTaskId,
            MrtmRequestTaskActionType.NON_COMPLIANCE_SAVE_APPLICATION,
            appUser,
            taskActionPayload
        );

        assertEquals(requestTaskPayload, actualRequestTaskPayload);

        verify(applyService).applySaveAction(requestTask, taskActionPayload);
        verify(requestTaskService).findTaskById(requestTaskId);
        verifyNoMoreInteractions(requestTaskService, applyService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.NON_COMPLIANCE_SAVE_APPLICATION);
    }
}
