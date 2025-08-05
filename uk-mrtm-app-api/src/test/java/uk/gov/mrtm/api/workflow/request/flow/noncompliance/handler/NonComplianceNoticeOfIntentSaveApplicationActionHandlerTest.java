package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceNoticeOfIntentApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceNoticeOfIntentSaveApplicationActionHandlerTest {

    @InjectMocks
    private NonComplianceNoticeOfIntentSaveApplicationActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NonComplianceNoticeOfIntentApplyService applyService;

    @Test
    void process() {

        final long requestTaskId = 1L;
        final RequestTask requestTask = RequestTask.builder().id(requestTaskId)
            .payload(NonComplianceNoticeOfIntentRequestTaskPayload.builder().build())
            .build();
        final NonComplianceNoticeOfIntentSaveApplicationRequestTaskActionPayload taskActionPayload =
            NonComplianceNoticeOfIntentSaveApplicationRequestTaskActionPayload.builder().build();
        final NonComplianceNoticeOfIntentRequestTaskPayload expectedRequestTaskPayload =
            NonComplianceNoticeOfIntentRequestTaskPayload.builder().build();
        final AppUser appUser = AppUser.builder().build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        RequestTaskPayload actualRequestTaskPayload = handler.process(requestTaskId,
            MrtmRequestTaskActionType.NON_COMPLIANCE_NOTICE_OF_INTENT_SAVE_APPLICATION,
            appUser,
            taskActionPayload
        );

        assertEquals(expectedRequestTaskPayload, actualRequestTaskPayload);
        verify(applyService).applySaveAction(requestTask, taskActionPayload);
        verify(requestTaskService).findTaskById(requestTaskId);
        verifyNoMoreInteractions(applyService, requestTaskService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(
            MrtmRequestTaskActionType.NON_COMPLIANCE_NOTICE_OF_INTENT_SAVE_APPLICATION);
    }
}
