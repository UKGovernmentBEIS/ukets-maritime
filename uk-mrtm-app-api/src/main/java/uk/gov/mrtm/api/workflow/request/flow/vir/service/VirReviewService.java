package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirSaveReviewRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.mapper.VirMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class VirReviewService {

    private final RequestService requestService;
    private final RequestActionUserInfoResolver requestActionUserInfoResolver;
    private static final VirMapper VIR_MAPPER = Mappers.getMapper(VirMapper.class);

    @Transactional
    public void saveReview(final VirSaveReviewRequestTaskActionPayload payload,
                           final RequestTask requestTask) {
        
        final VirApplicationReviewRequestTaskPayload taskPayload =
            (VirApplicationReviewRequestTaskPayload) requestTask.getPayload();

        taskPayload.setRegulatorReviewResponse(payload.getRegulatorReviewResponse());
        taskPayload.setSectionsCompleted(payload.getSectionsCompleted());
    }

    @Transactional
    public void submitReview(final RequestTask requestTask,
                             final DecisionNotification notifyOperatorDecision,
                             final AppUser appUser) {

        final Request request = requestTask.getRequest();
        final VirRequestPayload virRequestPayload = (VirRequestPayload) request.getPayload();
        final VirApplicationReviewRequestTaskPayload
            taskPayload = (VirApplicationReviewRequestTaskPayload) requestTask.getPayload();

        // Update request
        virRequestPayload.setSectionsCompleted(taskPayload.getSectionsCompleted());
        virRequestPayload.setRegulatorReviewResponse(taskPayload.getRegulatorReviewResponse());
        virRequestPayload.setDecisionNotification(notifyOperatorDecision);
        virRequestPayload.setRegulatorReviewer(appUser.getUserId());
    }

    @Transactional
    public void addReviewedRequestAction(final String requestId) {
        
        final Request request = requestService.findRequestById(requestId);
        final VirRequestPayload requestPayload = (VirRequestPayload) request.getPayload();
        final VirRequestMetadata virRequestMetadata = (VirRequestMetadata) request.getMetadata();

        final VirApplicationReviewedRequestActionPayload actionPayload = VIR_MAPPER
                .toVirApplicationReviewedRequestActionPayload(
                        requestPayload, virRequestMetadata.getYear(), MrtmRequestActionPayloadType.VIR_APPLICATION_REVIEWED_PAYLOAD);

        final DecisionNotification notification = requestPayload.getDecisionNotification();
        final Map<String, RequestActionUserInfo> usersInfo = requestActionUserInfoResolver
                .getUsersInfo(notification.getOperators(), notification.getSignatory(), request);
        actionPayload.setUsersInfo(usersInfo);

        requestService.addActionToRequest(
                request,
                actionPayload,
                MrtmRequestActionType.VIR_APPLICATION_REVIEWED,
                requestPayload.getRegulatorReviewer());
    }
}
