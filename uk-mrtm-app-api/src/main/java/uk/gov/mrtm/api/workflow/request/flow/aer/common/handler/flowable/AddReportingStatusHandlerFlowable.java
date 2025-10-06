package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusHistoryCreationService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class AddReportingStatusHandlerFlowable implements JavaDelegate {

    private final AccountReportingStatusHistoryCreationService accountReportingStatusHistoryCreationService;
    private final RequestService requestService;

    @Override
    public void execute(DelegateExecution execution) {
        String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        Request request = requestService.findRequestById(requestId);
        AerRequestMetadata requestMetadata = (AerRequestMetadata) request.getMetadata();

        accountReportingStatusHistoryCreationService
            .submitReportingStatus(request.getAccountId(), null, "SYSTEM", requestMetadata.getYear());
    }
}
