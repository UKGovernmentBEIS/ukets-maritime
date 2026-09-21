package uk.gov.mrtm.api.workflow.request.flow.rfi.handler;

import java.util.List;

import org.springframework.stereotype.Service;

import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.RfiRdePreviewOfficialNoticeService;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateType;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.PreviewDocumentAbstractHandler;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

@Service
public class RfiOfficialLetterPreviewHandler extends PreviewDocumentAbstractHandler {

    private final RfiRdePreviewOfficialNoticeService rfiRdePreviewOfficialNoticeService;

    public RfiOfficialLetterPreviewHandler(final RequestTaskService requestTaskService,
                                           final RfiRdePreviewOfficialNoticeService rfiRdePreviewOfficialNoticeService) {
        super(requestTaskService);
        this.rfiRdePreviewOfficialNoticeService = rfiRdePreviewOfficialNoticeService;
    }

    @Override
    protected FileDTO generateDocument(final Long taskId, final DecisionNotification decisionNotification) {
        final RequestTask requestTask = requestTaskService.findTaskById(taskId);
        return rfiRdePreviewOfficialNoticeService.generateRfiPreview(requestTask, decisionNotification);
    }

    @Override
    public List<String> getTypes() {
        return List.of(DocumentTemplateType.IN_RFI);
    }

    @Override
    protected List<String> getTaskTypes() {
        return List.of(
                MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW,
                MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS,
                MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW,
                MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_AMENDS,
                MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_REVIEW,
                MrtmRequestTaskType.VIR_APPLICATION_REVIEW
        );
    }
}
