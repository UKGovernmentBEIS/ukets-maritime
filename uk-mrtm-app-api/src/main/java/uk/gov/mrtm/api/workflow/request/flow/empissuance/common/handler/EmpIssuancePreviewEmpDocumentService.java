package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
public abstract class EmpIssuancePreviewEmpDocumentService implements EmpPreviewDocumentService {

    private final RequestTaskService requestTaskService;
    private final EmpPreviewCreateEmpDocumentService empPreviewCreateEmpDocumentService;
    private final DateService dateService;


    @Transactional(readOnly = true)
    public FileDTO create(final Long taskId, final DecisionNotification decisionNotification) {

        final RequestTask requestTask = requestTaskService.findTaskById(taskId);
        final EmpIssuanceApplicationReviewRequestTaskPayload taskPayload =
            (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();
        final Request request = requestTask.getRequest();
        final Long accountId = request.getAccountId();
        
        final EmissionsMonitoringPlan emp = taskPayload.getEmissionsMonitoringPlan();
        final Map<UUID, String> attachments = taskPayload.getAttachments();

        final int consolidationNumber = 1; // consolidation number default value

        return empPreviewCreateEmpDocumentService.getFile(
            decisionNotification,
            request,
            accountId,
            emp,
            attachments,
            Collections.emptyList(),
            consolidationNumber,
            request.getSubmissionDate(),
            dateService.getLocalDateTime()
        );
    }

}
