package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

@Service
@RequiredArgsConstructor
public class NonComplianceNoticeOfIntentApplyService {

    public void applySaveAction(final RequestTask requestTask,
                                final NonComplianceNoticeOfIntentSaveApplicationRequestTaskActionPayload taskActionPayload) {

        final NonComplianceNoticeOfIntentRequestTaskPayload
            requestTaskPayload = (NonComplianceNoticeOfIntentRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.setNoticeOfIntent(taskActionPayload.getNoticeOfIntent());
        requestTaskPayload.setComments(taskActionPayload.getComments());
        requestTaskPayload.setSectionsCompleted(taskActionPayload.getSectionsCompleted());
    }

    public void saveRequestPeerReviewAction(final RequestTask requestTask,
                                            final String peerReviewer, String regulatorReviewer) {

        final NonComplianceNoticeOfIntentRequestTaskPayload taskPayload =
            (NonComplianceNoticeOfIntentRequestTaskPayload) requestTask.getPayload();
        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) requestTask.getRequest().getPayload();

        requestPayload.setNoticeOfIntent(taskPayload.getNoticeOfIntent());
        requestPayload.setNoticeOfIntentComments(taskPayload.getComments());
        requestPayload.setNonComplianceAttachments(taskPayload.getNonComplianceAttachments());
        requestPayload.setNoticeOfIntentSectionsCompleted(taskPayload.getSectionsCompleted());

        requestPayload.setRegulatorPeerReviewer(peerReviewer);
        requestPayload.setRegulatorReviewer(regulatorReviewer);
    }
}
