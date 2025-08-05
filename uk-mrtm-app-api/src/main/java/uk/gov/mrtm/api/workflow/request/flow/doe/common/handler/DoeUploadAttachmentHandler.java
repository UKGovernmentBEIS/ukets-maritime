package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoeUploadAttachmentService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskUploadAttachmentActionHandler;

@Component
@RequiredArgsConstructor
public class DoeUploadAttachmentHandler extends RequestTaskUploadAttachmentActionHandler {

    private final DoeUploadAttachmentService doeUploadAttachmentService;

    @Override
    public void uploadAttachment(Long requestTaskId, String attachmentUuid, String filename) {
        doeUploadAttachmentService.uploadAttachment(requestTaskId, attachmentUuid, filename);
    }

    @Override
    public String getType() {
        return MrtmRequestTaskActionType.DOE_UPLOAD_ATTACHMENT;
    }
}
