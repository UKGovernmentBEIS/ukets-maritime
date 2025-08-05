package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmpVariationUploadAttachmentService {

    private final RequestTaskService requestTaskService;

    @Transactional
    public void uploadAttachment(final Long requestTaskId, final String attachmentUuid, final String filename) {
        
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final EmpVariationApplicationSubmitRequestTaskPayload requestTaskPayload =
                (EmpVariationApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.getEmpAttachments().put(UUID.fromString(attachmentUuid), filename);
    }
}
