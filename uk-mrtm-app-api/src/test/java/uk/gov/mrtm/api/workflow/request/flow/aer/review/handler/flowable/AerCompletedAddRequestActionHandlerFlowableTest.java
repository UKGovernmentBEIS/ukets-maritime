package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.service.AerCompleteService;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerCompletedAddRequestActionHandlerFlowableTest {

    @Mock
    private AerCompleteService aerCompleteService;

    @Mock
    private DelegateExecution delegateExecution;

    @InjectMocks
    private AerCompletedAddRequestActionHandlerFlowable handler;

    private final String requestId = "TEST-REQUEST-123";


    @Test
    void execute_skipped() {

        when(delegateExecution.getVariable(MrtmBpmnProcessConstants.AER_REVIEW_OUTCOME))
                .thenReturn(ReviewOutcome.SKIPPED);
        when(delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);


        handler.execute(delegateExecution);

        verify(aerCompleteService).addRequestAction(requestId, true);
        verifyNoMoreInteractions(aerCompleteService);
    }

    @Test
    void execute_completed() throws Exception {

        when(delegateExecution.getVariable(MrtmBpmnProcessConstants.AER_REVIEW_OUTCOME))
                .thenReturn(ReviewOutcome.COMPLETED);
        when(delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        handler.execute(delegateExecution);

        verify(aerCompleteService).addRequestAction(requestId, false);
        verifyNoMoreInteractions(aerCompleteService);
    }

}
