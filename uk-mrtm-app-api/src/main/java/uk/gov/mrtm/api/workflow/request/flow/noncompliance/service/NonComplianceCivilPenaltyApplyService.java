package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltySaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

@Service
@RequiredArgsConstructor
public class NonComplianceCivilPenaltyApplyService {

    public void applySaveAction(final RequestTask requestTask,
                                final NonComplianceCivilPenaltySaveApplicationRequestTaskActionPayload taskActionPayload) {

        final NonComplianceCivilPenaltyRequestTaskPayload
            requestTaskPayload = (NonComplianceCivilPenaltyRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.setCivilPenalty(taskActionPayload.getCivilPenalty());
        requestTaskPayload.setPenaltyAmount(taskActionPayload.getPenaltyAmount());
        requestTaskPayload.setDueDate(taskActionPayload.getDueDate());
        requestTaskPayload.setComments(taskActionPayload.getComments());
        requestTaskPayload.setSectionsCompleted(taskActionPayload.getSectionsCompleted());
    }

    public void saveRequestPeerReviewAction(final RequestTask requestTask,
                                            final String peerReviewer, String regulatorReviewer) {

        final NonComplianceCivilPenaltyRequestTaskPayload taskPayload =
            (NonComplianceCivilPenaltyRequestTaskPayload) requestTask.getPayload();
        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) requestTask.getRequest().getPayload();

        requestPayload.setCivilPenalty(taskPayload.getCivilPenalty());
        requestPayload.setCivilPenaltyAmount(taskPayload.getPenaltyAmount());
        requestPayload.setCivilPenaltyDueDate(taskPayload.getDueDate());
        requestPayload.setCivilPenaltyComments(taskPayload.getComments());
        requestPayload.setNonComplianceAttachments(taskPayload.getNonComplianceAttachments());
        requestPayload.setCivilPenaltySectionsCompleted(taskPayload.getSectionsCompleted());

        requestPayload.setRegulatorPeerReviewer(peerReviewer);
        requestPayload.setRegulatorReviewer(regulatorReviewer);
    }
}
