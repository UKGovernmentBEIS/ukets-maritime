package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceApplicationRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmpIssuanceUploadAttachmentService {

    private final RequestTaskService requestTaskService;

    @Transactional
    public void uploadAttachment(final Long requestTaskId, final String attachmentUuid, final String filename) {
        
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final EmpIssuanceApplicationRequestTaskPayload requestTaskPayload =
                (EmpIssuanceApplicationRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.getEmpAttachments().put(UUID.fromString(attachmentUuid), filename);
    }
}
