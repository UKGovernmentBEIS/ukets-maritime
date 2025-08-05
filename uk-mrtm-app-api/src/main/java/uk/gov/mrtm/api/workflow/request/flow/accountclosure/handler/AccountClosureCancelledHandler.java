package uk.gov.mrtm.api.workflow.request.flow.accountclosure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.service.RequestAccountClosureService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AccountClosureCancelledHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

	private final RequestAccountClosureService requestAccountClosureService;
    private final WorkflowService workflowService;
    private final RequestTaskService requestTaskService;
    

    @Override
    public RequestTaskPayload process(Long requestTaskId,
                                      String requestTaskActionType,
                                      AppUser appUser,
                                      RequestTaskActionEmptyPayload taskActionPayload) {

        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        requestAccountClosureService.cancel(requestTask.getRequest().getId());
        
        workflowService.completeTask(requestTask.getProcessTaskId());

        return requestTask.getPayload();
    }

	@Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.ACCOUNT_CLOSURE_CANCEL_APPLICATION);
    }
}
