package uk.gov.mrtm.api.workflow.request.flow.aer.verify.handler;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestRecallActionHandler;

import java.util.List;

@Component
public class AerRequestVerificationRecallActionHandler extends RequestRecallActionHandler {

    public AerRequestVerificationRecallActionHandler(RequestTaskService requestTaskService,
                                                    RequestService requestService,
                                                     WorkflowService workflowService) {
        super(requestTaskService, requestService, workflowService);
    }

    @Override
    public String getRequestActionType() {
        return MrtmRequestActionType.AER_RECALLED_FROM_VERIFICATION;
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.AER_RECALL_FROM_VERIFICATION);
    }
}
