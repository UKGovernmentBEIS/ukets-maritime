package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceOutcome;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.mapper.NonComplianceMapper;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation.NonComplianceApplicationValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class NonComplianceFinalDeterminationSubmitApplicationActionHandler
    implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private static final NonComplianceMapper NON_COMPLIANCE_MAPPER = Mappers.getMapper(NonComplianceMapper.class);

    private final RequestTaskService requestTaskService;
    private final NonComplianceApplicationValidator validator;
    private final WorkflowService workflowService;
    private final RequestService requestService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final RequestTaskActionEmptyPayload taskActionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final NonComplianceFinalDeterminationRequestTaskPayload taskPayload =
            (NonComplianceFinalDeterminationRequestTaskPayload) requestTask.getPayload();

        validator.validateFinalDetermination(taskPayload);

        final Request request = requestTask.getRequest();
        final NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload actionPayload =
            NON_COMPLIANCE_MAPPER.toFinalDeterminationSubmittedRequestAction(taskPayload,
                MrtmRequestActionPayloadType.NON_COMPLIANCE_FINAL_DETERMINATION_APPLICATION_SUBMITTED_PAYLOAD);

        requestService.addActionToRequest(
            request,
            actionPayload,
            MrtmRequestActionType.NON_COMPLIANCE_FINAL_DETERMINATION_APPLICATION_SUBMITTED,
            appUser.getUserId()
        );

        final boolean reissuePenalty = Boolean.TRUE.equals(taskPayload.getFinalDetermination().getReissuePenalty());

        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) request.getPayload();
        requestPayload.setReIssueCivilPenalty(reissuePenalty);

        final NonComplianceOutcome
            outcome = reissuePenalty ? NonComplianceOutcome.REISSUE_CIVIL_PENALTY : NonComplianceOutcome.SUBMITTED; 
        workflowService.completeTask(requestTask.getProcessTaskId(), Map.of(
            MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, outcome
        ));

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.NON_COMPLIANCE_FINAL_DETERMINATION_SUBMIT_APPLICATION);
    }
}
