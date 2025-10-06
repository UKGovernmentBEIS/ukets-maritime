package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.EmpIssuanceDeemedWithdrawnAddRequestActionService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceDeemedWithdrawnAddRequestActionHandlerFlowableTest {

    @InjectMocks
    private EmpIssuanceDeemedWithdrawnAddRequestActionHandlerFlowable handler;

    @Mock
    private EmpIssuanceDeemedWithdrawnAddRequestActionService addRequestActionService;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() {
        final String requestId = "requestId";

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        handler.execute(execution);

        verify(execution, times(1)).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(addRequestActionService, times(1)).addRequestAction(requestId);
        verifyNoMoreInteractions(addRequestActionService);
    }
}