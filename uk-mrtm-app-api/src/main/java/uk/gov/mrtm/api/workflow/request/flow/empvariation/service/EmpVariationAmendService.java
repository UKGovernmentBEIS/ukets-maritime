package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationAmendsSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveApplicationAmendRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationReviewMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;

@Service
@RequiredArgsConstructor
public class EmpVariationAmendService {

    private final EmpValidatorService empValidatorService;
    private final RequestService requestService;
    private static final EmpVariationReviewMapper MAPPER = Mappers.getMapper(EmpVariationReviewMapper.class);

    @Transactional
    public void saveAmend(EmpVariationSaveApplicationAmendRequestTaskActionPayload actionPayload, RequestTask requestTask) {
        EmpVariationApplicationAmendsSubmitRequestTaskPayload taskPayload =
                (EmpVariationApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        taskPayload.setEmpVariationDetails(actionPayload.getEmpVariationDetails());
        taskPayload.setEmpVariationDetailsCompleted(actionPayload.getEmpVariationDetailsCompleted());
        taskPayload.setEmissionsMonitoringPlan(actionPayload.getEmissionsMonitoringPlan());
        taskPayload.setEmpSectionsCompleted(actionPayload.getEmpSectionsCompleted());
        taskPayload.setEmpVariationDetailsReviewCompleted(actionPayload.getEmpVariationDetailsReviewCompleted());
        taskPayload.setEmpVariationDetailsAmendCompleted(actionPayload.getEmpVariationDetailsAmendCompleted());
        taskPayload.setUpdatedSubtasks(actionPayload.getUpdatedSubtasks());
    }

    @Transactional
    public void submitAmend(RequestTask requestTask, AppUser appUser) {

        Request request = requestTask.getRequest();
        EmpVariationApplicationAmendsSubmitRequestTaskPayload taskPayload =
                (EmpVariationApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        // Validate monitoring plan
        EmissionsMonitoringPlanContainer empContainer = MAPPER.toEmissionsMonitoringPlanContainer(taskPayload);
        empValidatorService.validateEmissionsMonitoringPlan(empContainer, request.getAccountId());

        // Update request payload
        EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();

        requestPayload.setEmissionsMonitoringPlan(taskPayload.getEmissionsMonitoringPlan());
        requestPayload.setEmpAttachments(taskPayload.getEmpAttachments());
        requestPayload.setEmpVariationDetails(taskPayload.getEmpVariationDetails());
        requestPayload.setEmpVariationDetailsCompleted(taskPayload.getEmpVariationDetailsCompleted());
        requestPayload.setEmpVariationDetailsReviewCompleted(taskPayload.getEmpVariationDetailsReviewCompleted());
        resetTypeOnUpdatedReviewGroupDecisions(taskPayload, requestPayload);

        // Add timeline
        addAmendsSubmittedRequestAction(request, appUser);
    }

    private void resetTypeOnUpdatedReviewGroupDecisions(EmpVariationApplicationAmendsSubmitRequestTaskPayload taskPayload,
                                                        EmpVariationRequestPayload requestPayload) {

        taskPayload.getUpdatedSubtasks().forEach(empReviewGroup -> {
            if (requestPayload.getReviewGroupDecisions().containsKey(empReviewGroup)) {
                EmpVariationReviewDecision decision = requestPayload.getReviewGroupDecisions().get(empReviewGroup);
                if (EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED == decision.getType()) {
                    ((ChangesRequiredDecisionDetails) decision.getDetails()).setRequiredChanges(null);
                } else if (EmpVariationReviewDecisionType.ACCEPTED == decision.getType()) {
                    ((EmpAcceptedVariationDecisionDetails) decision.getDetails()).setVariationScheduleItems(null);
                }
                decision.setType(null);
            }
        });
    }

    private void addAmendsSubmittedRequestAction(Request request, AppUser appUser) {
        EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();

        EmpVariationApplicationAmendsSubmittedRequestActionPayload amendsSubmittedRequestActionPayload =
                MAPPER.toEmpVariationApplicationAmendsSubmittedRequestActionPayload(
                        requestPayload, MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_AMENDS_SUBMITTED_PAYLOAD);

        requestService.addActionToRequest(
                request,
                amendsSubmittedRequestActionPayload,
                MrtmRequestActionType.EMP_VARIATION_APPLICATION_AMENDS_SUBMITTED,
                appUser.getUserId());
    }
}
