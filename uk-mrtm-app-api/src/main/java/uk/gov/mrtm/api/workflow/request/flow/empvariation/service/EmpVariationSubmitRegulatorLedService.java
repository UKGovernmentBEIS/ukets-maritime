package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveApplicationRegulatorLedRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmpVariationSubmitRegulatorLedService {

    @Transactional
    public void saveEmpVariation(
            EmpVariationSaveApplicationRegulatorLedRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {
        EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload taskPayload = (EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload) requestTask
                .getPayload();

        taskPayload.setEmissionsMonitoringPlan(taskActionPayload.getEmissionsMonitoringPlan());
        taskPayload.setEmpSectionsCompleted(taskActionPayload.getEmpSectionsCompleted());
        taskPayload.setEmpVariationDetails(taskActionPayload.getEmpVariationDetails());
        taskPayload.setEmpVariationDetailsCompleted(taskActionPayload.getEmpVariationDetailsCompleted());
        taskPayload.setReasonRegulatorLed(taskActionPayload.getReasonRegulatorLed());
    }

    @Transactional
    public void saveReviewGroupDecision(
            EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload requestTaskActionPayload,
            RequestTask requestTask) {
        EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload
                requestTaskPayload = (EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.setEmpSectionsCompleted(requestTaskActionPayload.getEmpSectionsCompleted());

        Map<EmpReviewGroup, EmpAcceptedVariationDecisionDetails> reviewGroupDecisions = requestTaskPayload.getReviewGroupDecisions();
        reviewGroupDecisions.put(requestTaskActionPayload.getGroup(), requestTaskActionPayload.getDecision());
    }

    @Transactional
    public void saveDecisionNotification(RequestTask requestTask, DecisionNotification decisionNotification,
                                         AppUser appUser) {
        EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload taskPayload = (EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload) requestTask
                .getPayload();

        EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) requestTask.getRequest()
                .getPayload();

        requestPayload.setRegulatorReviewer(appUser.getUserId());
        requestPayload.setEmissionsMonitoringPlan(taskPayload.getEmissionsMonitoringPlan());
        requestPayload.setEmpVariationDetails(taskPayload.getEmpVariationDetails());
        requestPayload.setEmpAttachments(taskPayload.getEmpAttachments());
        requestPayload.setEmpSectionsCompleted(taskPayload.getEmpSectionsCompleted());
        requestPayload.setEmpVariationDetailsCompleted(taskPayload.getEmpVariationDetailsCompleted());
        requestPayload.setReviewGroupDecisionsRegulatorLed(taskPayload.getReviewGroupDecisions());
        requestPayload.setReasonRegulatorLed(taskPayload.getReasonRegulatorLed());

        requestPayload.setDecisionNotification(decisionNotification);
    }
}
