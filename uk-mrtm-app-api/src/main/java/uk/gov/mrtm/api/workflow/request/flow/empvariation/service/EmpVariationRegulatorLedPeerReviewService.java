package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

@Service
@RequiredArgsConstructor
public class EmpVariationRegulatorLedPeerReviewService {

	@Transactional
    public void saveRequestPeerReviewAction(final RequestTask requestTask,
                                            final String selectedPeerReviewer,
                                            final String appUserId) {
        final EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload taskPayload =
            (EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload) requestTask.getPayload();

        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) requestTask.getRequest().getPayload();

        requestPayload.setRegulatorPeerReviewer(selectedPeerReviewer);
        requestPayload.setRegulatorReviewer(appUserId);
		requestPayload.setEmissionsMonitoringPlan(taskPayload.getEmissionsMonitoringPlan());
		requestPayload.setEmpVariationDetails(taskPayload.getEmpVariationDetails());
		requestPayload.setEmpAttachments(taskPayload.getEmpAttachments());
		requestPayload.setEmpSectionsCompleted(taskPayload.getEmpSectionsCompleted());
		requestPayload.setEmpVariationDetailsCompleted(taskPayload.getEmpVariationDetailsCompleted());
		requestPayload.setReviewGroupDecisionsRegulatorLed(taskPayload.getReviewGroupDecisions());
		requestPayload.setReasonRegulatorLed(taskPayload.getReasonRegulatorLed());
    }
}
