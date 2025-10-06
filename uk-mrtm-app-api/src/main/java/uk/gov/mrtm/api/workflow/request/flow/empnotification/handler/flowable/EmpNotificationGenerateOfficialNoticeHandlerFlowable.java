package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationOfficialNoticeService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpNotificationGenerateOfficialNoticeHandlerFlowable implements JavaDelegate {

    private final EmpNotificationOfficialNoticeService service;

    @Override
    public void execute(DelegateExecution execution) {

        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        final MrtmDeterminationType determinationType =
            (MrtmDeterminationType) execution.getVariable(BpmnProcessConstants.REVIEW_DETERMINATION);
        switch (determinationType) {
            case GRANTED:
                service.generateAndSaveGrantedOfficialNotice(requestId);
                break;
            case REJECTED:
                service.generateAndSaveRejectedOfficialNotice(requestId);
                break;
            default:
                throw new UnsupportedOperationException("Determination type is not supported: " + determinationType);
        }

    }
}
