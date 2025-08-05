package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationFollowUpUploadAttachmentService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskUploadAttachmentActionHandler;

@Component
@RequiredArgsConstructor
public class EmpNotificationFollowUpUploadAttachmentHandler extends RequestTaskUploadAttachmentActionHandler {

    private final EmpNotificationFollowUpUploadAttachmentService service;

    @Override
    public void uploadAttachment(Long requestTaskId, String attachmentUuid, String filename) {
        service.uploadAttachment(requestTaskId, attachmentUuid, filename);
    }

    @Override
    public String getType() {
        return MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_UPLOAD_ATTACHMENT;
    }
}
