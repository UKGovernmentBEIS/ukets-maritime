package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.service.AerReviewUploadAttachmentService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskUploadAttachmentActionHandler;

@Component
@RequiredArgsConstructor
public class AerReviewUploadAttachmentHandler extends RequestTaskUploadAttachmentActionHandler {

    private final AerReviewUploadAttachmentService uploadAttachmentService;

    @Override
    public void uploadAttachment(Long requestTaskId, String attachmentUuid, String filename) {
        uploadAttachmentService.uploadAttachment(requestTaskId, attachmentUuid, filename);

    }

    @Override
    public String getType() {
        return MrtmRequestTaskActionType.AER_UPLOAD_REVIEW_GROUP_DECISION_ATTACHMENT;
    }
}
