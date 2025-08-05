package uk.gov.mrtm.api.workflow.request.flow.aer.verify.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerVerificationReturnToOperatorRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerVerificationReturnedToOperatorRequestActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerVerificationReturnToOperatorActionHandlerTest {

    @InjectMocks
    private AerVerificationReturnToOperatorActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestService requestService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        final long taskId = 1L;
        final AppUser user = AppUser.builder().build();
        final AerVerificationReturnToOperatorRequestTaskActionPayload payload = AerVerificationReturnToOperatorRequestTaskActionPayload
                .builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.AER_VERIFICATION_RETURN_TO_OPERATOR_PAYLOAD)
                .changesRequired("Changes required")
                .build();

        final AerVerificationReturnedToOperatorRequestActionPayload actionPayload = AerVerificationReturnedToOperatorRequestActionPayload
                .builder()
                .changesRequired("Changes required")
                .payloadType(MrtmRequestActionPayloadType.AER_VERIFICATION_RETURNED_TO_OPERATOR_PAYLOAD)
                .build();

        final String processId = "processId";
        final String requestId = "requestId";

        final Request request = Request
                .builder()
                .type(RequestType.builder().code(MrtmRequestType.AER).build())
                .build();

        final RequestTask task = RequestTask.builder()
                .request(Request.builder().id(requestId).build())
                .processTaskId(processId)
                .request(request)
                .build();

        when(requestTaskService.findTaskById(taskId)).thenReturn(task);

        handler.process(taskId, MrtmRequestTaskActionType.AER_VERIFICATION_RETURN_TO_OPERATOR, user, payload);

        verify(requestTaskService, times(1)).findTaskById(taskId);
        verify(requestService, times(1)).addActionToRequest(request, actionPayload, MrtmRequestActionType.AER_VERIFICATION_RETURNED_TO_OPERATOR, user.getUserId());
        verify(workflowService, times(1)).completeTask(processId);
        verifyNoMoreInteractions(requestTaskService, requestService, workflowService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsAnyElementsOf(List.of(MrtmRequestTaskActionType.AER_VERIFICATION_RETURN_TO_OPERATOR));
    }
}
