package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceOutcome;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.mapper.NonComplianceMapper;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceApplyService;
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

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class NonComplianceSubmitApplicationActionHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private static final NonComplianceMapper NON_COMPLIANCE_MAPPER = Mappers.getMapper(NonComplianceMapper.class);

    private final RequestTaskService requestTaskService;
    private final NonComplianceApplicationValidator validator;
    private final WorkflowService workflowService;
    private final RequestService requestService;
    private final NonComplianceApplyService nonComplianceApplyService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final RequestTaskActionEmptyPayload taskActionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final NonComplianceApplicationSubmitRequestTaskPayload taskPayload =
            (NonComplianceApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        final Boolean civilPenalty = taskPayload.getNonCompliancePenalties().getCivilPenalty();
        final Boolean initialPenalty = taskPayload.getNonCompliancePenalties().getInitialPenalty();
        final Boolean noticeOfIntent = taskPayload.getNonCompliancePenalties().getNoticeOfIntent();

        validator.validateApplication(taskPayload);

        final Request request = requestTask.getRequest();
        final NonComplianceApplicationSubmittedRequestActionPayload actionPayload =
            NON_COMPLIANCE_MAPPER.toSubmittedRequestAction(taskPayload, MrtmRequestActionPayloadType.NON_COMPLIANCE_APPLICATION_SUBMITTED_PAYLOAD);

        request.setSubmissionDate(LocalDateTime.now());
        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) request.getPayload();
        requestPayload.setIssueNoticeOfIntent(Boolean.TRUE.equals(noticeOfIntent));

        nonComplianceApplyService.submitDetails(request, taskPayload);

        requestService.addActionToRequest(
            request,
            actionPayload,
            MrtmRequestActionType.NON_COMPLIANCE_APPLICATION_SUBMITTED,
            appUser.getUserId()
        );

        final Map<String, Object> variables = new HashMap<>();
        variables.put(MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.SUBMITTED);
        variables.put(MrtmBpmnProcessConstants.CIVIL_PENALTY_LIABLE, civilPenalty);
        if (Boolean.TRUE.equals(civilPenalty)) {
            variables.put(MrtmBpmnProcessConstants.INITIAL_PENALTY_LIABLE, initialPenalty);
            variables.put(MrtmBpmnProcessConstants.NOI_PENALTY_LIABLE, noticeOfIntent);
        }

        workflowService.completeTask(requestTask.getProcessTaskId(), variables);

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.NON_COMPLIANCE_SUBMIT_APPLICATION);
    }
}
