package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceDecisionNotification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNotifyOperatorRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceOutcome;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.mapper.NonComplianceMapper;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceApplyService;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceSendOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation.NonComplianceApplicationValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class NonComplianceNoticeOfIntentNotifyOperatorActionHandler
    implements RequestTaskActionHandler<NonComplianceNotifyOperatorRequestTaskActionPayload> {

    private static final NonComplianceMapper NON_COMPLIANCE_MAPPER = Mappers.getMapper(NonComplianceMapper.class);
    
    private final RequestTaskService requestTaskService;
    private final NonComplianceApplicationValidator validator;
    private final RequestService requestService;
    private final RequestActionUserInfoResolver requestActionUserInfoResolver;
    private final WorkflowService workflowService;
    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final NonComplianceSendOfficialNoticeService officialNoticeService;
    private final NonComplianceApplyService nonComplianceApplyService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final NonComplianceNotifyOperatorRequestTaskActionPayload taskActionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final NonComplianceNoticeOfIntentRequestTaskPayload taskPayload =
            (NonComplianceNoticeOfIntentRequestTaskPayload) requestTask.getPayload();
        final NonComplianceDecisionNotification decisionNotification = taskActionPayload.getDecisionNotification();
        final Set<String> operators = decisionNotification.getOperators();
        final Set<Long> externalContacts = decisionNotification.getExternalContacts();
        final Request request = requestTask.getRequest();

        // validate
        validator.validateNoticeOfIntent(taskPayload);
        validator.validateUsers(requestTask, operators, externalContacts,  appUser);

        nonComplianceApplyService.submitDetails(request, taskPayload);

        // add timeline action
        Optional<UserInfoDTO> requestAccountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request);
        final Map<String, RequestActionUserInfo> usersInfo = requestAccountPrimaryContact.isPresent() ?
            requestActionUserInfoResolver.getUsersInfo(operators, request) : null;
        final NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload actionPayload =
            NON_COMPLIANCE_MAPPER.toNoticeOfIntentSubmittedRequestAction(taskPayload,
                decisionNotification,
                usersInfo,
                MrtmRequestActionPayloadType.NON_COMPLIANCE_NOTICE_OF_INTENT_APPLICATION_SUBMITTED_PAYLOAD);
        
        requestService.addActionToRequest(
            request,
            actionPayload,
            MrtmRequestActionType.NON_COMPLIANCE_NOTICE_OF_INTENT_APPLICATION_SUBMITTED,
            appUser.getUserId()
        );

        // complete task
        workflowService.completeTask(requestTask.getProcessTaskId(), Map.of(
            MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.SUBMITTED
        ));

        // send email
        officialNoticeService.sendOfficialNotice(taskPayload.getNoticeOfIntent(), request, decisionNotification);

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.NON_COMPLIANCE_NOTICE_OF_INTENT_NOTIFY_OPERATOR);
    }
}
