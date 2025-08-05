package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirOfficialNoticeService;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.PreviewDocumentAbstractHandler;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;

@Service
public class VirPreviewHandler extends PreviewDocumentAbstractHandler {

    private final VirOfficialNoticeService virOfficialNoticeService;
    private final RequestService requestService;


    public VirPreviewHandler(final RequestTaskService requestTaskService,
                             final VirOfficialNoticeService virOfficialNoticeService,
                             final RequestService requestService

    ) {
        super(requestTaskService);
        this.virOfficialNoticeService = virOfficialNoticeService;
        this.requestService = requestService;
    }

    @Override
    protected FileDTO generateDocument(final Long taskId, final DecisionNotification decisionNotification) {
        final RequestTask requestTask = requestTaskService.findTaskById(taskId);
        Request dbRequest = requestService.findRequestById(requestTask.getRequest().getId());
        VirApplicationReviewRequestTaskPayload payload =(VirApplicationReviewRequestTaskPayload) requestTask.getPayload();
        ((VirRequestPayload) dbRequest.getPayload()).setRegulatorReviewResponse(payload.getRegulatorReviewResponse());
        ((VirRequestPayload) dbRequest.getPayload()).setDecisionNotification(decisionNotification);
        return virOfficialNoticeService.doGenerateOfficialNoticeWithoutSave(dbRequest);
    }


    @Override
    public List<String> getTypes() {
        return List.of(MrtmDocumentTemplateType.VIR_REVIEWED);
    }

    @Override
    protected List<String> getTaskTypes() {
        return List.of(MrtmRequestTaskType.VIR_APPLICATION_REVIEW);
    }
}
