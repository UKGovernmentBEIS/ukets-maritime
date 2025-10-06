package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler.camunda;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationOfficialNoticeService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationGenerateOfficialNoticeHandlerTest {
    private static final String REQUEST_ID = "1";

    @InjectMocks
    private EmpNotificationGenerateOfficialNoticeHandler handler;

    @Mock
    private EmpNotificationOfficialNoticeService service;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute_granted() {

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(REQUEST_ID);
        when(execution.getVariable(BpmnProcessConstants.REVIEW_DETERMINATION)).thenReturn(
            MrtmDeterminationType.GRANTED);

        handler.execute(execution);

        verify(execution).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(execution).getVariable(BpmnProcessConstants.REVIEW_DETERMINATION);
        verify(service).generateAndSaveGrantedOfficialNotice(REQUEST_ID);
        verifyNoMoreInteractions(service);
    }

    @Test
    void execute_rejected() {

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(REQUEST_ID);
        when(execution.getVariable(BpmnProcessConstants.REVIEW_DETERMINATION)).thenReturn(
            MrtmDeterminationType.REJECTED);

        handler.execute(execution);

        verify(execution).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(execution).getVariable(BpmnProcessConstants.REVIEW_DETERMINATION);
        verify(service).generateAndSaveRejectedOfficialNotice(REQUEST_ID);
        verifyNoMoreInteractions(service);
    }
}
