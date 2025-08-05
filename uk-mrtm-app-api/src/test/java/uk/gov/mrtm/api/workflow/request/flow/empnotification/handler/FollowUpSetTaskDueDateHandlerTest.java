package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestExpirationType;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestTaskTimeManagementService;

import java.time.ZoneId;
import java.util.Date;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FollowUpSetTaskDueDateHandlerTest {

    @InjectMocks
    private FollowUpSetTaskDueDateHandler cut;

    @Mock
    private RequestTaskTimeManagementService requestTaskTimeManagementService;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() {
        String requestId = "1";
        Date expirationDate = new Date();

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(execution.getVariable(MrtmBpmnProcessConstants.FOLLOW_UP_RESPONSE_EXPIRATION_DATE)).thenReturn(expirationDate);

        cut.execute(execution);

        verify(requestTaskTimeManagementService).setDueDateToTasks(requestId, MrtmRequestExpirationType.FOLLOW_UP_RESPONSE,
                expirationDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        verify(execution).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(execution).getVariable(MrtmBpmnProcessConstants.FOLLOW_UP_RESPONSE_EXPIRATION_DATE);
    }
}