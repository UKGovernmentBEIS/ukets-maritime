package uk.gov.mrtm.api.workflow.request.flow.accountclosure.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.service.MrtmAccountUpdateService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestStatus;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureSaveRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureSubmittedRequestActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class RequestAccountClosureService {
	
	private final RequestService requestService;
	private final MrtmAccountUpdateService mrtmAccountUpdateService;
	private final AccountClosureValidatorService validatorService;
	
	@Transactional
    public void applySavePayload(AccountClosureSaveRequestTaskActionPayload actionPayload,
								 RequestTask requestTask) {

		AccountClosureSubmitRequestTaskPayload taskPayload =
				(AccountClosureSubmitRequestTaskPayload) requestTask.getPayload();

		taskPayload.setAccountClosure(actionPayload.getAccountClosure());
	}

	@Transactional
	public void applySubmitAction(RequestTask requestTask, AppUser appUser) {
		Request request = requestTask.getRequest();
		Long accountId = request.getAccountId();
        AccountClosureSubmitRequestTaskPayload taskPayload =
            (AccountClosureSubmitRequestTaskPayload) requestTask.getPayload();
        
        validatorService.validateAccountClosureObject(taskPayload.getAccountClosure());

        // add action
        addAccountClosureSubmittedRequestAction(appUser, request, taskPayload);
        
        // update account status to CLOSED
        mrtmAccountUpdateService.closeAccount(
        		accountId, appUser, taskPayload.getAccountClosure().getReason());
	}

	@Transactional
    public void cancel(final String requestId) {

        final Request request = requestService.findRequestById(requestId);
        final String assignee = request.getPayload().getRegulatorAssignee();

        request.setStatus(MrtmRequestStatus.CANCELLED);
        requestService.addActionToRequest(request,
            null,
            MrtmRequestActionType.ACCOUNT_CLOSURE_CANCELLED,
            assignee);
    }

	private void addAccountClosureSubmittedRequestAction(AppUser appUser, Request request,
														 AccountClosureSubmitRequestTaskPayload taskPayload) {
		AccountClosureSubmittedRequestActionPayload actionPayload =
				AccountClosureSubmittedRequestActionPayload
						.builder()
						.payloadType(MrtmRequestActionPayloadType.ACCOUNT_CLOSURE_SUBMITTED_PAYLOAD)
						.accountClosure(taskPayload.getAccountClosure())
						.build();

		requestService.addActionToRequest(
				request,
				actionPayload,
				MrtmRequestActionType.ACCOUNT_CLOSURE_SUBMITTED,
				appUser.getUserId()
		);
	}

}
