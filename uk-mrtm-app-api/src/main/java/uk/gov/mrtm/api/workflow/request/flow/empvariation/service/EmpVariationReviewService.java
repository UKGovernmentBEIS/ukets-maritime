package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveApplicationReviewRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveReviewDeterminationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmpVariationReviewService {


    @Transactional
    public void saveEmpVariation(EmpVariationSaveApplicationReviewRequestTaskActionPayload taskActionPayload,
                                 RequestTask requestTask) {
        EmpVariationApplicationReviewRequestTaskPayload
                requestTaskPayload = (EmpVariationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        resetDeterminationIfNotDeemedWithdrawn(requestTaskPayload);

        updateRequestTaskPayload(taskActionPayload, requestTaskPayload);
    }

    @Transactional
    public void saveReviewGroupDecision(EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload actionPayload, RequestTask requestTask) {
        EmpVariationApplicationReviewRequestTaskPayload
                taskPayload = (EmpVariationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        final EmpReviewGroup group = actionPayload.getGroup();
        final EmpVariationReviewDecision decision = actionPayload.getDecision();

        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = taskPayload.getReviewGroupDecisions();
        reviewGroupDecisions.put(group, decision);
        taskPayload.setEmpSectionsCompleted(actionPayload.getEmpSectionsCompleted());


        resetDeterminationIfNotDeemedWithdrawn(taskPayload);
    }

    @Transactional
    public void saveDetailsReviewGroupDecision(EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload payload, RequestTask requestTask) {
        EmpVariationApplicationReviewRequestTaskPayload
                taskPayload = (EmpVariationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        taskPayload.setEmpVariationDetailsReviewDecision(payload.getDecision());
        taskPayload.setEmpVariationDetailsReviewCompleted(payload.getEmpVariationDetailsReviewCompleted());
        taskPayload.setEmpVariationDetailsCompleted(payload.getEmpVariationDetailsCompleted());

        resetDeterminationIfNotDeemedWithdrawn(taskPayload);
    }

    @Transactional
    public void saveRequestPeerReviewAction(RequestTask requestTask, String selectedPeerReviewer, AppUser appUser) {
        Request request = requestTask.getRequest();
        EmpVariationApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                (EmpVariationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        EmpVariationRequestPayload requestPayload =
                (EmpVariationRequestPayload) request.getPayload();

        updateRequestPayload(requestPayload, reviewRequestTaskPayload, appUser);
        requestPayload.setRegulatorPeerReviewer(selectedPeerReviewer);
    }

    @Transactional
    public void saveDecisionNotification(RequestTask requestTask, DecisionNotification decisionNotification,
                                         AppUser appUser) {
        EmpVariationApplicationReviewRequestTaskPayload taskPayload =
                (EmpVariationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        EmpVariationRequestPayload requestPayload =
                (EmpVariationRequestPayload) requestTask.getRequest().getPayload();

        updateRequestPayload(requestPayload, taskPayload, appUser);
        requestPayload.setDecisionNotification(decisionNotification);
    }

    @Transactional
    public void saveDetermination(EmpVariationSaveReviewDeterminationRequestTaskActionPayload taskActionPayload,
                                  RequestTask requestTask) {
        EmpVariationApplicationReviewRequestTaskPayload taskPayload =
                (EmpVariationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        taskPayload.setDetermination(taskActionPayload.getDetermination());
        taskPayload.setEmpSectionsCompleted(taskActionPayload.getEmpSectionsCompleted());
    }

    @Transactional
    public void saveRequestReturnForAmends(RequestTask requestTask, AppUser appUser) {
        Request request = requestTask.getRequest();
        EmpVariationApplicationReviewRequestTaskPayload taskPayload =
                (EmpVariationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        EmpVariationRequestPayload requestPayload =
                (EmpVariationRequestPayload) request.getPayload();

        updateRequestPayload(requestPayload, taskPayload, appUser);
    }

    private void updateRequestPayload(EmpVariationRequestPayload requestPayload,
                                      EmpVariationApplicationReviewRequestTaskPayload taskPayload,
                                      AppUser appUser) {

        requestPayload.setRegulatorReviewer(appUser.getUserId());
        requestPayload.setEmpVariationDetails(taskPayload.getEmpVariationDetails());
        requestPayload.setEmpVariationDetailsCompleted(taskPayload.getEmpVariationDetailsCompleted());
        requestPayload.setEmpVariationDetailsReviewCompleted(taskPayload.getEmpVariationDetailsReviewCompleted());
        requestPayload.setEmpVariationDetailsReviewDecision(taskPayload.getEmpVariationDetailsReviewDecision());
        requestPayload.setEmissionsMonitoringPlan(taskPayload.getEmissionsMonitoringPlan());
        requestPayload.setEmpSectionsCompleted(taskPayload.getEmpSectionsCompleted());
        requestPayload.setEmpAttachments(taskPayload.getEmpAttachments());
        requestPayload.setReviewGroupDecisions(taskPayload.getReviewGroupDecisions());
        requestPayload.setReviewAttachments(taskPayload.getReviewAttachments());
        requestPayload.setDetermination(taskPayload.getDetermination());
    }

    private void resetDeterminationIfNotDeemedWithdrawn(
            EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload) {
        EmpVariationDetermination determination = requestTaskPayload.getDetermination();
        if (determination != null && EmpVariationDeterminationType.DEEMED_WITHDRAWN != determination.getType()) {
            requestTaskPayload.setDetermination(null);
        }
    }

    private void updateRequestTaskPayload(
            EmpVariationSaveApplicationReviewRequestTaskActionPayload taskActionPayload,
            EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload) {

        requestTaskPayload.setEmpVariationDetails(taskActionPayload.getEmpVariationDetails());
        requestTaskPayload.setEmpVariationDetailsCompleted(taskActionPayload.getEmpVariationDetailsCompleted());
        requestTaskPayload.setEmissionsMonitoringPlan(taskActionPayload.getEmissionsMonitoringPlan());
        requestTaskPayload.setEmpVariationDetailsReviewCompleted(taskActionPayload.getEmpVariationDetailsReviewCompleted());
        requestTaskPayload.setEmpSectionsCompleted(taskActionPayload.getEmpSectionsCompleted());
    }
}
