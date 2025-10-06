package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CollectAccountsForAerHandlerFlowableTest {

    @InjectMocks
    private CollectAccountsForAerHandlerFlowable collectAccountsForAerHandler;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Mock
    private DelegateExecution execution;

    @Test
    void executeAutomaticWorkflow() {
        Long accountId1 = 1L;
        Long accountId2 = 2L;
        List<Long> accounts = List.of(accountId1, accountId2);

        when(execution.hasVariable(BpmnProcessConstants.ACCOUNT_IDS)).thenReturn(false);
        when(mrtmAccountQueryService.getAccountIdsByStatuses(List.of(
            MrtmAccountStatus.NEW,
            MrtmAccountStatus.LIVE,
            MrtmAccountStatus.WITHDRAWN))).thenReturn(accounts);

        // Invoke
        collectAccountsForAerHandler.execute(execution);

        verify(execution, times(1)).setVariable("accounts", accounts);
    }

    @Test
    void executeManualWorkflow() {
        Long accountId1 = 1L;
        Long accountId2 = 2L;

        when(execution.hasVariable(BpmnProcessConstants.ACCOUNT_IDS)).thenReturn(true);
        when(execution.getVariable(BpmnProcessConstants.ACCOUNT_IDS))
            .thenReturn(List.of(accountId1.toString(), accountId2.toString()));
        when(mrtmAccountQueryService.existsAccountById(accountId1)).thenReturn(true);
        when(mrtmAccountQueryService.existsAccountById(accountId2)).thenReturn(false);


        // Invoke
        collectAccountsForAerHandler.execute(execution);

        verify(execution, times(1)).setVariable("accounts",  List.of(accountId1));
        verify(mrtmAccountQueryService, never()).getAccountIdsByStatuses(any());
    }

}