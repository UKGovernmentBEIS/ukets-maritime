package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestCustomContext;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class FollowUpSetRequestTypePrefixHandlerTest {

    @InjectMocks
    private FollowUpSetRequestTypePrefixHandler cut;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() throws Exception {
        // Invoke
        cut.execute(execution);

        // Verify
        verify(execution, times(1)).setVariable(BpmnProcessConstants.REQUEST_TYPE_DYNAMIC_TASK_PREFIX, MrtmRequestCustomContext.EMP_NOTIFICATION_FOLLOW_UP.getCode());
    }
}
