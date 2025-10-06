package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.service.AerCompleteService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerCompleteHandlerFlowableTest {

    @Mock
    private AerCompleteService aerCompleteService;

    @Mock
    private DelegateExecution delegateExecution;

    @InjectMocks
    private AerCompleteHandlerFlowable handler;


    @Test
    void execute() throws Exception {

        String requestId = "TEST-REQUEST-123";
        when(delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        handler.execute(delegateExecution);

        verify(aerCompleteService).complete(requestId);
        verifyNoMoreInteractions(aerCompleteService);
    }
}
