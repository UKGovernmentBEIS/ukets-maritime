package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.util.List;

/**
 * Collects account ids to initiate AER for: </br>
 *
 * <ul>
 *     <li>LIVE accounts when the associated timer in Camunda has been executed</li>
 *     <li>OR for the provided account ids through the Camunda REST API. It is useful when some AERs have not been successfully executed
 *     when the timer kicked in.</li>
 * </ul>
 */
@Log4j2
@Service
@RequiredArgsConstructor
public class CollectAccountsForAerHandler implements JavaDelegate {
    private final MrtmAccountQueryService accountQueryService;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        execution.setVariable("accounts", getAccounts(execution));
    }

    private List<Long> getAccounts(DelegateExecution execution) {
        if (!execution.getProcessInstance().hasVariable(BpmnProcessConstants.ACCOUNT_IDS)) {
            return accountQueryService.getAccountIdsByStatuses(List.of(
                MrtmAccountStatus.NEW,
                MrtmAccountStatus.LIVE,
                MrtmAccountStatus.WITHDRAWN));
        }

        List<String> providedAccountIds =
            (List<String>) execution.getProcessInstance().getVariable(BpmnProcessConstants.ACCOUNT_IDS);

        return getExistingAccounts(providedAccountIds);
    }

    private List<Long> getExistingAccounts(List<String> providedAccountIds) {
        return providedAccountIds
                .stream()
                .map(accountId -> Long.parseLong(accountId.trim()))
                .filter(accountQueryService::existsAccountById)
                .toList();
    }
}
