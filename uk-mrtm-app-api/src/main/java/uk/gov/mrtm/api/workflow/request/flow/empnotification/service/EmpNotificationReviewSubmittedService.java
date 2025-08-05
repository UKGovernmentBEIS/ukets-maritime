package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper.EmpNotificationMapper;
import uk.gov.netz.api.common.utils.DateUtils;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.time.LocalDate;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class EmpNotificationReviewSubmittedService {

    private final RequestService requestService;
    private final RequestActionUserInfoResolver requestActionUserInfoResolver;
    private final EmpNotificationOfficialNoticeService noticeService;

    private static final EmpNotificationMapper empNotificationMapper = Mappers.getMapper(EmpNotificationMapper.class);

    public void executeGrantedPostActions(String requestId) {
        executePostActions(requestId, MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_GRANTED_PAYLOAD,
            MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_GRANTED);
    }

    public void executeRejectedPostActions(String requestId) {
        executePostActions(requestId, MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_REJECTED_PAYLOAD,
            MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_REJECTED);
    }

    private void executePostActions(String requestId, String actionPayloadType, String actionType) {
        Request request = requestService.findRequestById(requestId);
        EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();

        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload actionPayload = empNotificationMapper
            .toEmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload(requestPayload, actionPayloadType);

        DecisionNotification reviewDecisionNotification = requestPayload.getReviewDecisionNotification();

        actionPayload.setUsersInfo(requestActionUserInfoResolver
            .getUsersInfo(reviewDecisionNotification.getOperators(), reviewDecisionNotification.getSignatory(), request)
        );

        // Add action
        requestService.addActionToRequest(request, actionPayload, actionType, requestPayload.getRegulatorReviewer());

        // send official notice 
        noticeService.sendOfficialNotice(request);
    }
    
    public boolean isFollowUpNeeded(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        final FollowUp followUpFromInitialReview = ((EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails()).getFollowUp();
        return followUpFromInitialReview.getFollowUpResponseRequired();
    }

    public Date resolveFollowUpExpirationDate(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        
		final LocalDate expirationDateFromInitialReview = ((EmpNotificationAcceptedDecisionDetails) requestPayload
				.getReviewDecision().getDetails()).getFollowUp().getFollowUpResponseExpirationDate();

		LocalDate expirationDateFromFollowUpResponseReview = null;
		if (requestPayload.getFollowUpReviewDecision() != null &&
				requestPayload.getFollowUpReviewDecision().getType() == EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED) {
			expirationDateFromFollowUpResponseReview = ((EmpNotificationFollowupRequiredChangesDecisionDetails) requestPayload
					.getFollowUpReviewDecision().getDetails()).getDueDate();
		}

		final LocalDate expirationDate = expirationDateFromFollowUpResponseReview != null
				? expirationDateFromFollowUpResponseReview
				: expirationDateFromInitialReview;

        return DateUtils.atEndOfDay(expirationDate);
    }

    public void executeFollowUpCompletedPostActions(final String requestId) {

        final Request request = requestService.findRequestById(requestId);
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        final DecisionNotification followUpReviewDecisionNotification = requestPayload.getFollowUpReviewDecisionNotification();

        final EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload actionPayload =
                EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_COMPLETED_PAYLOAD)
                .request(((EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails()).getFollowUp().getFollowUpRequest())
                .response(requestPayload.getFollowUpResponse())
                .responseFiles(requestPayload.getFollowUpResponseFiles())
                .responseAttachments(requestPayload.getFollowUpResponseAttachments())
                .responseExpirationDate(((EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails()).getFollowUp()
                    .getFollowUpResponseExpirationDate())
                .responseSubmissionDate(requestPayload.getFollowUpResponseSubmissionDate())
                .reviewDecision(requestPayload.getFollowUpReviewDecision())
                .reviewDecisionNotification(followUpReviewDecisionNotification)
                .sectionsCompleted(requestPayload.getFollowUpSectionsCompleted())
                .build();

        actionPayload.setUsersInfo(requestActionUserInfoResolver
            .getUsersInfo(followUpReviewDecisionNotification.getOperators(), followUpReviewDecisionNotification.getSignatory(), request)
        );

        // add timeline action
        requestService.addActionToRequest(request,
            actionPayload,
            MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_COMPLETED,
            requestPayload.getRegulatorReviewer());

        // send official notice 
        noticeService.sendFollowUpOfficialNotice(request);
    }
}
