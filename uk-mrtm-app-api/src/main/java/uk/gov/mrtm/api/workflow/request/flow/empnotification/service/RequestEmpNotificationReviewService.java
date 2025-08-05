package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

@Service
@RequiredArgsConstructor
public class RequestEmpNotificationReviewService {

    @Transactional
    public void saveReviewDecision(EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload taskActionPayload,
                                   RequestTask requestTask) {
        final EmpNotificationApplicationReviewRequestTaskPayload taskPayload =
                (EmpNotificationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        taskPayload.setReviewDecision(taskActionPayload.getReviewDecision());
        taskPayload.setSectionsCompleted(taskActionPayload.getSectionsCompleted());
    }

    @Transactional
    public void saveRequestPeerReviewAction(RequestTask requestTask, String selectedPeerReview, AppUser appUser) {
        final Request request = requestTask.getRequest();
        final EmpNotificationApplicationReviewRequestTaskPayload taskPayload =
                (EmpNotificationApplicationReviewRequestTaskPayload) requestTask.getPayload();
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();

        requestPayload.setReviewDecision(taskPayload.getReviewDecision());
        requestPayload.setRegulatorReviewer(appUser.getUserId());
        requestPayload.setRegulatorPeerReviewer(selectedPeerReview);
        requestPayload.setReviewSectionsCompleted(taskPayload.getSectionsCompleted());
    }
}
