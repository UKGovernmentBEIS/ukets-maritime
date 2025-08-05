package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.service.EmpIssuanceUploadAttachmentService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskUploadAttachmentActionHandler;

@Component
@RequiredArgsConstructor
public class EmpIssuanceUploadAttachmentHandler extends RequestTaskUploadAttachmentActionHandler {

    private final EmpIssuanceUploadAttachmentService empIssuanceUploadAttachmentService;
    
    @Override
    public void uploadAttachment(Long requestTaskId, String attachmentUuid, String filename) {
        empIssuanceUploadAttachmentService.uploadAttachment(requestTaskId, attachmentUuid, filename);
    }

    @Override
    public String getType() {
        return MrtmRequestTaskActionType.EMP_ISSUANCE_UPLOAD_SECTION_ATTACHMENT;
    }
}
