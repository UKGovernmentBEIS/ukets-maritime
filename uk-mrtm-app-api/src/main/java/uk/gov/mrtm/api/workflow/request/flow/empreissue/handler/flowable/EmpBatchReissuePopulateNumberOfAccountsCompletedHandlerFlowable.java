package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler.flowable;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;

import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueQueryService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Log4j2
@Service
@RequiredArgsConstructor
public class EmpBatchReissuePopulateNumberOfAccountsCompletedHandlerFlowable implements JavaDelegate {

	private final EmpBatchReissueQueryService empBatchReissueQueryService;

    @Override
    public void execute(DelegateExecution execution) {
    	final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
    	final long accountsCompletedNumber = empBatchReissueQueryService.getNumberOfAccountsCompleted(requestId);
    	execution.setVariable(MrtmBpmnProcessConstants.BATCH_NUMBER_OF_ACCOUNTS_COMPLETED, accountsCompletedNumber);
    }
}
