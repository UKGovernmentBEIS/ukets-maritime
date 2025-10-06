package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationAddCancelledRequestActionService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationAddCancelledRequestActionHandlerFlowableTest {

    @InjectMocks
    private EmpVariationAddCancelledRequestActionHandlerFlowable handler;

    @Mock
    private EmpVariationAddCancelledRequestActionService service;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() throws Exception {
        String requestId = "1";
        String userRole = RoleTypeConstants.OPERATOR;
        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(execution.getVariable(BpmnProcessConstants.REQUEST_INITIATOR_ROLE_TYPE)).thenReturn(userRole);

        handler.execute(execution);

        verify(execution, times(1)).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(execution, times(1)).getVariable(BpmnProcessConstants.REQUEST_INITIATOR_ROLE_TYPE);
        verify(service, times(1)).add(requestId, userRole);

        verifyNoMoreInteractions(service);
    }
}
