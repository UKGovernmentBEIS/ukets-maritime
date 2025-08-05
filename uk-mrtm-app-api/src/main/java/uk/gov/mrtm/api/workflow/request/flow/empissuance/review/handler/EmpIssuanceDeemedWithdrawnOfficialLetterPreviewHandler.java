package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.PreviewOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.EmpIssuanceOfficialLetterPreviewHandler;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;

@Service
public class EmpIssuanceDeemedWithdrawnOfficialLetterPreviewHandler
        extends EmpIssuanceOfficialLetterPreviewHandler {

    private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;

    public EmpIssuanceDeemedWithdrawnOfficialLetterPreviewHandler(final RequestTaskService requestTaskService,
                                                                  final PreviewOfficialNoticeService
                                                                      previewOfficialNoticeService,
                                                                  final FileDocumentGenerateServiceDelegator
                                                                      fileDocumentGenerateServiceDelegator) {
        super(requestTaskService, previewOfficialNoticeService);
        this.fileDocumentGenerateServiceDelegator = fileDocumentGenerateServiceDelegator;
    }

    @Override
    protected FileDTO generateDocument(final Long taskId, final DecisionNotification decisionNotification) {

        final TemplateParams templateParams = this.constructTemplateParams(taskId,decisionNotification);

        return fileDocumentGenerateServiceDelegator.generateFileDocument(
            MrtmDocumentTemplateType.EMP_ISSUANCE_DEEMED_WITHDRAWN,
            templateParams,
            "emp_application_withdrawn.pdf");
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmDocumentTemplateType.EMP_ISSUANCE_DEEMED_WITHDRAWN);
    }

    @Override
    protected List<String> getTaskTypes() {
        return List.of(
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS
        );
    }

}
