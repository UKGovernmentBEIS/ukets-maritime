package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestTaskAttachable;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NonComplianceUploadAttachmentService {

    private final RequestTaskService requestTaskService;

    @Transactional
    public void uploadAttachment(final Long requestTaskId, 
                                 final String attachmentUuid, 
                                 final String filename) {
        
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final NonComplianceRequestTaskAttachable requestTaskPayload =
            (NonComplianceRequestTaskAttachable) requestTask.getPayload();
        requestTaskPayload.getNonComplianceAttachments().put(UUID.fromString(attachmentUuid), filename);
    }
}
