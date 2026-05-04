package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.flowable;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.ObjectUtils;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerCreationService;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.time.Year;

@Log4j2
@Service
@RequiredArgsConstructor
public class InitiateAersHandlerFlowable implements JavaDelegate {

    private final AerCreationService aerCreationService;

    @Override
    public void execute(DelegateExecution execution) {
        Long accountId = (Long) execution.getVariable(BpmnProcessConstants.ACCOUNT_ID);
        Integer year = ObjectUtils.defaultIfNull((Integer) execution.getVariable(MrtmBpmnProcessConstants.AER_YEAR), Year.now().getValue());
        initiateAerWorkflow(accountId, Year.of(year));
    }

    private void initiateAerWorkflow(Long accountId, Year year) {
        try {
            log.info("Creating AER workflow for account with id '{}'", accountId);
            aerCreationService.createRequestAerWithNewTransaction(accountId, year);
        } catch (Exception ex) {
            log.error("Could not create AER workflow for account with id '{}' failed with {}", accountId, ex);
        }
    }
}
