package uk.gov.mrtm.api.workflow.request.flow.aer.verify.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerVerificationReturnToOperatorRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerVerificationReturnedToOperatorRequestActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AerVerificationReturnToOperatorActionHandler
        implements RequestTaskActionHandler<AerVerificationReturnToOperatorRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestService requestService;
    private final WorkflowService workflowService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser, AerVerificationReturnToOperatorRequestTaskActionPayload payload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final Request request = requestTask.getRequest();

        AerVerificationReturnedToOperatorRequestActionPayload actionPayload = AerVerificationReturnedToOperatorRequestActionPayload
                .builder()
                .changesRequired(payload.getChangesRequired())
                .payloadType(MrtmRequestActionPayloadType.AER_VERIFICATION_RETURNED_TO_OPERATOR_PAYLOAD)
                .build();

        requestService.addActionToRequest(request,
                actionPayload,
                MrtmRequestActionType.AER_VERIFICATION_RETURNED_TO_OPERATOR,
                appUser.getUserId());

        workflowService.completeTask(requestTask.getProcessTaskId());
        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.AER_VERIFICATION_RETURN_TO_OPERATOR);
    }
}
