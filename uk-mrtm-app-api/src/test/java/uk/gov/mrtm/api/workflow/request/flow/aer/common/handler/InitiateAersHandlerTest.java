package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerCreationService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.time.Year;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InitiateAersHandlerTest {

    @InjectMocks
    private InitiateAersHandler initiateAersHandler;

    @Mock
    private AerCreationService aerCreationService;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute_auto_without_provided_accounts() throws Exception {
        Long accountId1 = 1L;
        when(execution.getVariable("accountId")).thenReturn(accountId1);

        // Invoke
        initiateAersHandler.execute(execution);

        // Verify
        verify(aerCreationService, timeout(1000).times(1)).createRequestAer(accountId1, Year.now());
    }

    @Test
    void execute_with_exception() throws Exception {
        Long accountId1 = 1L;

        when(execution.getVariable("accountId")).thenReturn(accountId1);
        Year year = Year.now().minusYears(1);
        when(execution.getVariable("aerYear")).thenReturn(year.getValue());

        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(aerCreationService)
            .createRequestAer(accountId1, year);

        // Invoke
        initiateAersHandler.execute(execution);

        // Verify
        verify(aerCreationService, timeout(1000).times(1)).createRequestAer(accountId1, year);
        verifyNoMoreInteractions(aerCreationService);
    }
}