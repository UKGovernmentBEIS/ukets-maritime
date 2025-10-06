package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.EmpIssuanceOfficialNoticeService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpIssuanceSendOfficialNoticeEmailHandler implements JavaDelegate {

    private final EmpIssuanceOfficialNoticeService empIssuanceOfficialNoticeService;

    @Override
    public void execute(DelegateExecution execution) throws Exception {

        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        final EmpIssuanceDeterminationType determinationType =
                (EmpIssuanceDeterminationType) execution.getVariable(BpmnProcessConstants.REVIEW_DETERMINATION);
        empIssuanceOfficialNoticeService.sendOfficialNotice(requestId, determinationType);
    }
}
