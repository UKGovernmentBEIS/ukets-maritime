package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestRecallActionHandler;

import java.util.List;

@Component
public class EmpVariationReviewRequestRecallActionHandler extends RequestRecallActionHandler {

    public EmpVariationReviewRequestRecallActionHandler(RequestTaskService requestTaskService,
                                                             RequestService requestService,
                                                             WorkflowService workflowService) {
        super(requestTaskService, requestService, workflowService);
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_VARIATION_RECALL_FROM_AMENDS);
    }

    @Override
    public String getRequestActionType() {
        return MrtmRequestActionType.EMP_VARIATION_RECALLED_FROM_AMENDS;
    }
}
