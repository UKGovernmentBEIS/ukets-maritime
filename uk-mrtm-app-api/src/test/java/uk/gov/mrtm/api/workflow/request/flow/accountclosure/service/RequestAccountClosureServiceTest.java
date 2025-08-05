package uk.gov.mrtm.api.workflow.request.flow.accountclosure.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.service.MrtmAccountUpdateService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosure;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureSaveRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureSubmittedRequestActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestAccountClosureServiceTest {

    @InjectMocks
    private RequestAccountClosureService service;

    @Mock
    private RequestService requestService;
    @Mock
    private MrtmAccountUpdateService mrtmAccountUpdateService;
    @Mock
    private AccountClosureValidatorService validatorService;


    @Test
    void applySavePayload() {

        AccountClosureSubmitRequestTaskPayload taskPayload = createTaskPayload();

        AccountClosureSaveRequestTaskActionPayload actionPayload = createTaskActionPayload();

        Request request = Request.builder().build();
        RequestTask requestTask = createRequestTask(taskPayload, request);

        service.applySavePayload(actionPayload, requestTask);

        assertThat(taskPayload.getAccountClosure()).isEqualTo(actionPayload.getAccountClosure());
        verifyNoInteractions(requestService, mrtmAccountUpdateService, validatorService);
    }

    @Test
    void applySubmitAction() {
        long accountId = 1L;
        AppUser appUser = AppUser.builder().userId("userId").build();
        AccountClosureSubmitRequestTaskPayload taskPayload = createTaskPayload();
        AccountClosureSubmittedRequestActionPayload actionPayload = createActionPayload();

        AccountClosureRequestPayload requestPayload = AccountClosureRequestPayload.builder().build();
        Request request = Request.builder().payload(requestPayload).requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();

        RequestTask requestTask = createRequestTask(taskPayload, request);

        service.applySubmitAction(requestTask, appUser);

        verify(validatorService).validateAccountClosureObject(taskPayload.getAccountClosure());
        verify(requestService).addActionToRequest(request, actionPayload,
                MrtmRequestActionType.ACCOUNT_CLOSURE_SUBMITTED, "userId");
        verify(mrtmAccountUpdateService).closeAccount(accountId, appUser, taskPayload.getAccountClosure().getReason());
        verifyNoMoreInteractions(requestService, mrtmAccountUpdateService, validatorService);
    }

    @Test
    void cancel() {
        long accountId = 1L;

        String requestId = "requestId";
        String assignee = "assignee";
        Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                .payload(AccountClosureRequestPayload.builder()
                        .regulatorAssignee(assignee)
                        .build())
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        service.cancel(requestId);

        assertEquals(MrtmRequestStatus.CANCELLED, request.getStatus());
        verify(requestService).addActionToRequest(request, null,
                MrtmRequestActionType.ACCOUNT_CLOSURE_CANCELLED, assignee);
        verifyNoMoreInteractions(requestService);
        verifyNoInteractions(mrtmAccountUpdateService, validatorService);
    }

    private RequestTask createRequestTask(AccountClosureSubmitRequestTaskPayload taskPayload, Request request) {
        RequestTaskType requestTaskType = RequestTaskType.builder().code(MrtmRequestTaskType.ACCOUNT_CLOSURE_SUBMIT).build();

        return RequestTask.builder()
                .id(1L)
                .type(requestTaskType)
                .payload(taskPayload)
                .request(request)
                .build();
    }

    private AccountClosureSaveRequestTaskActionPayload createTaskActionPayload() {
        return AccountClosureSaveRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.ACCOUNT_CLOSURE_SAVE_APPLICATION_PAYLOAD)
                .accountClosure(AccountClosure.builder().reason("test reason2").build())
                .build();
    }

    private AccountClosureSubmitRequestTaskPayload createTaskPayload() {
        return AccountClosureSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.ACCOUNT_CLOSURE_SUBMIT_PAYLOAD)
                .accountClosure(AccountClosure.builder().reason("test reason").build())
                .build();
    }

    private AccountClosureSubmittedRequestActionPayload createActionPayload() {
        return AccountClosureSubmittedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.ACCOUNT_CLOSURE_SUBMITTED_PAYLOAD)
                .accountClosure(AccountClosure.builder().reason("test reason").build())
                .build();
    }
}
