package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper.AerReviewMapper;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.service.RequestAerReviewService;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.validation.RequestAerReviewValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AerReviewReturnForAmendsActionHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestService requestService;
    private final RequestAerReviewValidatorService aerReviewValidatorService;
    private final RequestAerReviewService aerReviewService;
    private final WorkflowService workflowService;

    private final AerReviewMapper aerReviewMapper;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      RequestTaskActionEmptyPayload payload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        AerApplicationReviewRequestTaskPayload requestTaskPayload = (AerApplicationReviewRequestTaskPayload) requestTask.getPayload();

        // Validate that at least one review group is 'Operator to amend'
        aerReviewValidatorService.validateAtLeastOneReviewGroupAmendsNeeded(requestTaskPayload);

        // Update request payload
        aerReviewService.updateRequestPayloadWithReviewOutcome(requestTask, appUser);
        aerReviewService.removeAmendRequestedChangesSubtaskStatus((AerRequestPayload) requestTask.getRequest().getPayload());

        // Add request action
        createRequestAction(requestTask, appUser);

        // Close task
        workflowService.completeTask(requestTask.getProcessTaskId(),
            Map.of(MrtmBpmnProcessConstants.AER_REVIEW_OUTCOME, ReviewOutcome.AMENDS_NEEDED));

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.AER_REVIEW_RETURN_FOR_AMENDS);
    }

    private void createRequestAction(RequestTask requestTask, AppUser appUser) {
        Request request = requestTask.getRequest();
        AerApplicationReviewRequestTaskPayload requestTaskPayload = (AerApplicationReviewRequestTaskPayload) requestTask.getPayload();

        AerApplicationReturnedForAmendsRequestActionPayload requestActionPayload =
            aerReviewMapper.toAerApplicationReturnedForAmendsRequestActionPayload(
                requestTaskPayload,
                MrtmRequestActionPayloadType.AER_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD
            );

        requestService.addActionToRequest(
            request,
            requestActionPayload,
            MrtmRequestActionType.AER_APPLICATION_RETURNED_FOR_AMENDS,
            appUser.getUserId());
    }

}
