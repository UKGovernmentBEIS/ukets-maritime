package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoeUploadAttachmentService {

    private final RequestTaskService requestTaskService;

    @Transactional
    public void uploadAttachment(Long requestTaskId, String attachmentUuid, String filename) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        DoeApplicationSubmitRequestTaskPayload requestTaskPayload = (DoeApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        requestTaskPayload.getDoeAttachments().put(UUID.fromString(attachmentUuid), filename);
    }
}
