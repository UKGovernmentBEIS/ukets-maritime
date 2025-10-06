package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.EmpIssuanceOfficialNoticeService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpIssuanceDeemedWithdrawnGenerateOfficialNoticeHandlerFlowable implements JavaDelegate {

    private final EmpIssuanceOfficialNoticeService empIssuanceOfficialNoticeService;

    @Override
    public void execute(DelegateExecution execution) {
        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        empIssuanceOfficialNoticeService.generateAndSaveDeemedWithdrawnOfficialNotice(requestId);
    }
}
