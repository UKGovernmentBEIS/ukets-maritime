package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CollectAccountsForAerHandlerTest {

    @InjectMocks
    private CollectAccountsForAerHandler collectAccountsForAerHandler;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Mock
    private DelegateExecution execution;

    @Test
    void executeAutomaticWorkflow() throws Exception {
        Long accountId1 = 1L;
        Long accountId2 = 2L;
        List<Long> accounts = List.of(accountId1, accountId2);

        DelegateExecution delegateExecution = mock(DelegateExecution.class);
        when(execution.getProcessInstance()).thenReturn(delegateExecution);

        when(delegateExecution.hasVariable(BpmnProcessConstants.ACCOUNT_IDS)).thenReturn(false);
        when(mrtmAccountQueryService.getAccountIdsByStatuses(List.of(
            MrtmAccountStatus.NEW,
            MrtmAccountStatus.LIVE,
            MrtmAccountStatus.WITHDRAWN))).thenReturn(accounts);

        // Invoke
        collectAccountsForAerHandler.execute(execution);

        verify(execution, times(1)).setVariable("accounts", accounts);
    }

    @Test
    void executeManualWorkflow() throws Exception {
        Long accountId1 = 1L;
        Long accountId2 = 2L;

        DelegateExecution delegateExecution = mock(DelegateExecution.class);
        when(execution.getProcessInstance()).thenReturn(delegateExecution);

        when(delegateExecution.hasVariable(BpmnProcessConstants.ACCOUNT_IDS)).thenReturn(true);
        when(execution.getProcessInstance().getVariable(BpmnProcessConstants.ACCOUNT_IDS)).thenReturn(List.of(accountId1.toString(), accountId2.toString()));
        when(mrtmAccountQueryService.existsAccountById(accountId1)).thenReturn(true);
        when(mrtmAccountQueryService.existsAccountById(accountId2)).thenReturn(false);


        // Invoke
        collectAccountsForAerHandler.execute(execution);

        verify(execution, times(1)).setVariable("accounts",  List.of(accountId1));
        verify(mrtmAccountQueryService, never()).getAccountIdsByStatuses(any());
    }

}