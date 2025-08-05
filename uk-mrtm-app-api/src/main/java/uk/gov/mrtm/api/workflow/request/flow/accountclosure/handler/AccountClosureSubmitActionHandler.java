package uk.gov.mrtm.api.workflow.request.flow.accountclosure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.service.RequestAccountClosureService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AccountClosureSubmitActionHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {
	
	private static final String TERMINATE_REASON = "Workflow terminated by the system because the account was closed";

	private final RequestService requestService;
    private final RequestAccountClosureService requestAccountClosureService;
    private final WorkflowService workflowService;
    private final RequestTaskService requestTaskService;
    private final RequestQueryService requestQueryService;
    

    @Override
    public RequestTaskPayload process(Long requestTaskId,
                                      String requestTaskActionType,
                                      AppUser appUser,
                                      RequestTaskActionEmptyPayload payload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        Long accountId = requestTask.getRequest().getAccountId();

        requestAccountClosureService.applySubmitAction(requestTask, appUser);
        
        requestTask.getRequest().setSubmissionDate(LocalDateTime.now());

        // complete the current workflow
        workflowService.completeTask(requestTask.getProcessTaskId());
        
        // terminate all remaining workflows for this maritime account
        terminateAccountWorkflows(accountId);

        return requestTask.getPayload();
    }
    
    private void terminateAccountWorkflows(Long accountId) {
    	List<Request> accountRequests = requestQueryService.findInProgressRequestsByAccount(accountId);

    	accountRequests.forEach(ar -> {
    		workflowService.deleteProcessInstance(ar.getProcessInstanceId(), TERMINATE_REASON);

            ar.setStatus(MrtmRequestStatus.CANCELLED);

            requestService.addActionToRequest(ar, null, MrtmRequestActionType.REQUEST_TERMINATED, null);
    	});
	}

	@Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.ACCOUNT_CLOSURE_SUBMIT_APPLICATION);
    }
}
