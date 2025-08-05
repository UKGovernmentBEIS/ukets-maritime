package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

@Service
@RequiredArgsConstructor
public class NonComplianceInitialPenaltyNoticeApplyService {
    
    public void applySaveAction(final RequestTask requestTask,
                                final NonComplianceInitialPenaltyNoticeSaveApplicationRequestTaskActionPayload taskActionPayload) {

        final NonComplianceInitialPenaltyNoticeRequestTaskPayload
            requestTaskPayload = (NonComplianceInitialPenaltyNoticeRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.setInitialPenaltyNotice(taskActionPayload.getInitialPenaltyNotice());
        requestTaskPayload.setComments(taskActionPayload.getComments());
        requestTaskPayload.setSectionsCompleted(taskActionPayload.getSectionsCompleted());
    }

    public void saveRequestPeerReviewAction(final RequestTask requestTask,
                                            final String peerReviewer,
                                            final String regulatorReviewer) {

        final NonComplianceInitialPenaltyNoticeRequestTaskPayload taskPayload =
            (NonComplianceInitialPenaltyNoticeRequestTaskPayload) requestTask.getPayload();
        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) requestTask.getRequest().getPayload();

        requestPayload.setInitialPenaltyNotice(taskPayload.getInitialPenaltyNotice());
        requestPayload.setInitialPenaltyComments(taskPayload.getComments());
        requestPayload.setNonComplianceAttachments(taskPayload.getNonComplianceAttachments());
        requestPayload.setInitialPenaltySectionsCompleted(taskPayload.getSectionsCompleted());

        requestPayload.setRegulatorPeerReviewer(peerReviewer);
        requestPayload.setRegulatorReviewer(regulatorReviewer);
    }
}
