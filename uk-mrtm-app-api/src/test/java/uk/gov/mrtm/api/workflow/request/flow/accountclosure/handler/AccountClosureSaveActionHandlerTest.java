package uk.gov.mrtm.api.workflow.request.flow.accountclosure.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosure;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureSaveRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.service.RequestAccountClosureService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountClosureSaveActionHandlerTest {

    @InjectMocks
    private AccountClosureSaveActionHandler handler;

    @Mock
    private RequestAccountClosureService requestAccountClosureService;
    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {
        final AccountClosureSaveRequestTaskActionPayload actionPayload =
                AccountClosureSaveRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.ACCOUNT_CLOSURE_SAVE_APPLICATION_PAYLOAD)
                        .accountClosure(AccountClosure.builder().reason("test reason").build())
                        .build();

        RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        final RequestTask requestTask = RequestTask.builder().id(1L).payload(expectedRequestTaskPayload).build();
        final AppUser appUser = AppUser.builder().build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.ACCOUNT_CLOSURE_SAVE_APPLICATION,
            appUser,
            actionPayload);

        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(requestAccountClosureService, times(1)).applySavePayload(actionPayload, requestTask);
        verifyNoMoreInteractions(requestAccountClosureService,requestTaskService);

    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).isEqualTo(
                List.of(MrtmRequestTaskActionType.ACCOUNT_CLOSURE_SAVE_APPLICATION));
    }
}
