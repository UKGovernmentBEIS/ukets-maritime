package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationReviewUploadAttachmentService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskUploadAttachmentActionHandler;

@Component
@RequiredArgsConstructor
public class EmpVariationUploadReviewGroupAttachmentHandler extends RequestTaskUploadAttachmentActionHandler {

    private final EmpVariationReviewUploadAttachmentService empVariationReviewUploadAttachmentService;
    @Override
    public void uploadAttachment(Long requestTaskId, String attachmentUuid, String filename) {
        empVariationReviewUploadAttachmentService.uploadReviewGroupDecisionAttachment(requestTaskId, attachmentUuid, filename);

    }

    @Override
    public String getType() {
        return MrtmRequestTaskActionType.EMP_VARIATION_UPLOAD_REVIEW_GROUP_DECISION_ATTACHMENT;
    }
}
