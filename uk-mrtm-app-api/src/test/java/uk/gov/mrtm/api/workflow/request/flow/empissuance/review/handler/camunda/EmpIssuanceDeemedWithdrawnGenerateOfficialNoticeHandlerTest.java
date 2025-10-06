package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler.camunda;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.EmpIssuanceOfficialNoticeService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceDeemedWithdrawnGenerateOfficialNoticeHandlerTest {

    @InjectMocks
    private EmpIssuanceDeemedWithdrawnGenerateOfficialNoticeHandler handler;

    @Mock
    private EmpIssuanceOfficialNoticeService empIssuanceOfficialNoticeService;

    @Test
    void execute() throws Exception {
        final DelegateExecution execution = mock(DelegateExecution.class);
        final String requestId = "1";

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        handler.execute(execution);

        verify(empIssuanceOfficialNoticeService).generateAndSaveDeemedWithdrawnOfficialNotice(requestId);
        verifyNoMoreInteractions(empIssuanceOfficialNoticeService);
    }

}