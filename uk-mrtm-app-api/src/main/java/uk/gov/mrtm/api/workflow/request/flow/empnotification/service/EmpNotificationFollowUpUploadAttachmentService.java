package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

@Service
@RequiredArgsConstructor
public class EmpNotificationFollowUpUploadAttachmentService {

    private final RequestTaskService requestTaskService;

    @Transactional
    public void uploadAttachment(final Long requestTaskId,
                                 final String attachmentUuid,
                                 final String filename) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final EmpNotificationFollowUpRequestTaskPayload requestTaskPayload =
                (EmpNotificationFollowUpRequestTaskPayload) requestTask.getPayload();
        requestTaskPayload.getFollowUpAttachments().put(UUID.fromString(attachmentUuid), filename);
    }
}
