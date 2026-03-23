package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSaveApplicationAmendRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSaveApplicationReviewRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSaveReviewDeterminationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;

@Service
@RequiredArgsConstructor
public class RequestEmpReviewService {

    @Transactional
    public void applySaveAction(EmpIssuanceSaveApplicationReviewRequestTaskActionPayload empIssuanceReviewRequestTaskActionPayload,
                                RequestTask requestTask) {
        EmpIssuanceApplicationReviewRequestTaskPayload
                empIssuanceApplicationReviewRequestTaskPayload = (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();


        resetDeterminationIfApproved(empIssuanceApplicationReviewRequestTaskPayload);

        updateEmpReviewRequestTaskPayload(empIssuanceApplicationReviewRequestTaskPayload, empIssuanceReviewRequestTaskActionPayload);
    }

    @Transactional
    public void saveRequestReturnForAmends(RequestTask requestTask, AppUser appUser) {
        Request request = requestTask.getRequest();
        EmpIssuanceApplicationReviewRequestTaskPayload taskPayload =
            (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        EmpIssuanceRequestPayload empIssuanceRequestPayload =
            (EmpIssuanceRequestPayload) request.getPayload();

        updateEmpIssuanceRequestPayload(empIssuanceRequestPayload, taskPayload, appUser);
    }

    @Transactional
    public void saveReviewGroupDecision(EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {

        EmpIssuanceApplicationReviewRequestTaskPayload applicationReviewRequestTaskPayload =
                (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        applicationReviewRequestTaskPayload.getReviewGroupDecisions().put(taskActionPayload.getReviewGroup(), taskActionPayload.getDecision());
        applicationReviewRequestTaskPayload.setEmpSectionsCompleted(taskActionPayload.getEmpSectionsCompleted());

        resetDeterminationIfApproved(applicationReviewRequestTaskPayload);
    }

    @Transactional
    public void saveDetermination(EmpIssuanceSaveReviewDeterminationRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {
        EmpIssuanceApplicationReviewRequestTaskPayload taskPayload =
                (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        taskPayload.setDetermination(taskActionPayload.getDetermination());
        taskPayload.setEmpSectionsCompleted(taskActionPayload.getEmpSectionsCompleted());
    }

    @Transactional
    public void saveDecisionNotification(RequestTask requestTask, DecisionNotification decisionNotification,
                                         AppUser appUser) {
        EmpIssuanceApplicationReviewRequestTaskPayload taskPayload =
                (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        EmpIssuanceRequestPayload empIssuanceRequestPayload =
                (EmpIssuanceRequestPayload) requestTask.getRequest().getPayload();

        updateEmpIssuanceRequestPayload(empIssuanceRequestPayload, taskPayload, appUser);
        empIssuanceRequestPayload.setDecisionNotification(decisionNotification);
    }

    @Transactional
    public void saveRequestPeerReviewAction(RequestTask requestTask, String selectedPeerReviewer, AppUser appUser) {
        Request request = requestTask.getRequest();
        EmpIssuanceApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
            (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        EmpIssuanceRequestPayload empIssuanceRequestPayload =
            (EmpIssuanceRequestPayload) request.getPayload();

        updateEmpIssuanceRequestPayload(empIssuanceRequestPayload, reviewRequestTaskPayload, appUser);
        empIssuanceRequestPayload.setRegulatorPeerReviewer(selectedPeerReviewer);
    }

    @Transactional
    public void saveAmend(EmpIssuanceSaveApplicationAmendRequestTaskActionPayload actionPayload, RequestTask requestTask) {
        EmpIssuanceApplicationAmendsSubmitRequestTaskPayload taskPayload =
            (EmpIssuanceApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        updateEmpReviewRequestTaskPayload(taskPayload, actionPayload);
        taskPayload.setUpdatedSubtasks(actionPayload.getUpdatedSubtasks());
    }

    @Transactional
    public void submitAmend(RequestTask requestTask) {
        Request request = requestTask.getRequest();
        EmpIssuanceApplicationAmendsSubmitRequestTaskPayload taskPayload =
            (EmpIssuanceApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        // Update request payload
        EmpIssuanceRequestPayload requestPayload = (EmpIssuanceRequestPayload) request.getPayload();

        resetTypeOnUpdatedReviewGroupDecisions(taskPayload, requestPayload);
        requestPayload.setEmpAttachments(taskPayload.getEmpAttachments());
        requestPayload.setEmissionsMonitoringPlan(taskPayload.getEmissionsMonitoringPlan());
        requestPayload.setEmpSectionsCompleted(taskPayload.getEmpSectionsCompleted());
    }

    private void resetTypeOnUpdatedReviewGroupDecisions(EmpIssuanceApplicationAmendsSubmitRequestTaskPayload taskPayload,
                                                        EmpIssuanceRequestPayload requestPayload) {

        taskPayload.getUpdatedSubtasks().forEach(empReviewGroup -> {
            if (requestPayload.getReviewGroupDecisions().containsKey(empReviewGroup)) {
                EmpIssuanceReviewDecision decision = requestPayload.getReviewGroupDecisions().get(empReviewGroup);
                if (EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED == decision.getType()) {
                    ((ChangesRequiredDecisionDetails) decision.getDetails()).setRequiredChanges(null);
                }
                decision.setType(null);
            }
        });
    }

    private void resetDeterminationIfApproved(EmpIssuanceApplicationReviewRequestTaskPayload reviewRequestTaskPayload) {
        EmpIssuanceDetermination determination = reviewRequestTaskPayload.getDetermination();
        if (determination != null && EmpIssuanceDeterminationType.APPROVED.equals(determination.getType())) {
            reviewRequestTaskPayload.setDetermination(null);
        }
    }

    private void updateEmpReviewRequestTaskPayload(EmpIssuanceApplicationReviewRequestTaskPayload taskPayload,
                                                   EmpIssuanceSaveApplicationReviewRequestTaskActionPayload actionPayload) {
        taskPayload.setEmissionsMonitoringPlan(actionPayload.getEmissionsMonitoringPlan());
        taskPayload.setEmpSectionsCompleted(actionPayload.getEmpSectionsCompleted());
    }

    private void updateEmpIssuanceRequestPayload(EmpIssuanceRequestPayload empIssuanceRequestPayload,
                                                 EmpIssuanceApplicationReviewRequestTaskPayload reviewRequestTaskPayload,
                                                 AppUser appUser) {
        empIssuanceRequestPayload.setRegulatorReviewer(appUser.getUserId());
        empIssuanceRequestPayload.setEmissionsMonitoringPlan(reviewRequestTaskPayload.getEmissionsMonitoringPlan());
        empIssuanceRequestPayload.setEmpSectionsCompleted(reviewRequestTaskPayload.getEmpSectionsCompleted());
        empIssuanceRequestPayload.setEmpAttachments(reviewRequestTaskPayload.getEmpAttachments());
        empIssuanceRequestPayload.setReviewGroupDecisions(reviewRequestTaskPayload.getReviewGroupDecisions());
        empIssuanceRequestPayload.setReviewAttachments(reviewRequestTaskPayload.getReviewAttachments());
        empIssuanceRequestPayload.setDetermination(reviewRequestTaskPayload.getDetermination());
    }
}
