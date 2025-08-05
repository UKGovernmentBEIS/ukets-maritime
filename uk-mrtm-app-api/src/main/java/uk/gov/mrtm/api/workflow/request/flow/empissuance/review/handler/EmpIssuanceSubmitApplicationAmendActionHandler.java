package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationAmendsSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper.EmpReviewMapper;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.RequestEmpReviewService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
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

@Service
@RequiredArgsConstructor
public class EmpIssuanceSubmitApplicationAmendActionHandler implements
    RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestService requestService;
    private final RequestEmpReviewService requestEmpReviewService;
    private final WorkflowService workflowService;
    private final EmpValidatorService empValidatorService;
    private static final EmpReviewMapper EMP_REVIEW_MAPPER = Mappers.getMapper(EmpReviewMapper.class);

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      RequestTaskActionEmptyPayload payload) {

        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        EmpIssuanceApplicationAmendsSubmitRequestTaskPayload taskPayload =
            (EmpIssuanceApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        // Validate monitoring plan
        EmissionsMonitoringPlanContainer empContainer = EMP_REVIEW_MAPPER.toEmissionsMonitoringPlanContainer(taskPayload);
        empValidatorService.validateEmissionsMonitoringPlan(empContainer, requestTask.getRequest().getAccountId());

        requestEmpReviewService.submitAmend(requestTask);

        // Add timeline
        addAmendsSubmittedRequestAction(requestTask.getRequest(), appUser);

        workflowService.completeTask(requestTask.getProcessTaskId());

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_ISSUANCE_SUBMIT_APPLICATION_AMEND);
    }

    private void addAmendsSubmittedRequestAction(Request request, AppUser appUser) {
        EmpIssuanceRequestPayload requestPayload = (EmpIssuanceRequestPayload) request.getPayload();

        EmpIssuanceApplicationAmendsSubmittedRequestActionPayload amendsSubmittedRequestActionPayload =
            EMP_REVIEW_MAPPER.toEmpIssuanceApplicationAmendsSubmittedRequestActionPayload(requestPayload,
                MrtmRequestActionPayloadType.EMP_ISSUANCE_APPLICATION_AMENDS_SUBMITTED_PAYLOAD);

        requestService.addActionToRequest(
            request,
            amendsSubmittedRequestActionPayload,
            MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_AMENDS_SUBMITTED,
            appUser.getUserId());
    }
}
