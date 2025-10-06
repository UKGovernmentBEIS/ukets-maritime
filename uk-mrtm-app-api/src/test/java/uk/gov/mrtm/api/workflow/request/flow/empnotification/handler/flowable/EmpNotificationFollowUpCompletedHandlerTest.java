package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationReviewSubmittedService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpCompletedHandlerTest {

    @InjectMocks
    private EmpNotificationFollowUpCompletedHandlerFlowable handler;

    @Mock
    private EmpNotificationReviewSubmittedService reviewSubmittedService;

    @Test
    void execute() {

        final DelegateExecution execution = mock(DelegateExecution.class);
        final String requestId = "1";

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        // invoke
        handler.execute(execution);

        verify(execution).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(reviewSubmittedService).executeFollowUpCompletedPostActions(requestId);
        verifyNoMoreInteractions(reviewSubmittedService);
    }
}
