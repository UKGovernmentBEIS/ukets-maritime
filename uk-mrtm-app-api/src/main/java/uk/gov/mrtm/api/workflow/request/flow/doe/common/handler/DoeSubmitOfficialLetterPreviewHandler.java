package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.PreviewOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.PreviewDocumentAbstractHandler;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DoeSubmitOfficialLetterPreviewHandler extends PreviewDocumentAbstractHandler {

    private final PreviewOfficialNoticeService previewOfficialNoticeService;
    private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;
    private static final String DOE_AND_EFSN_NOTICE_FILE_NAME = "DoE_and_EFSN_Notice.pdf";
    private static final String EFSN_NOTICE_FILE_NAME = "EFSN_Notice.pdf";

    public DoeSubmitOfficialLetterPreviewHandler(final RequestTaskService requestTaskService,
                                                 final PreviewOfficialNoticeService previewOfficialNoticeService,
                                                 final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator) {
        super(requestTaskService);
        this.previewOfficialNoticeService = previewOfficialNoticeService;
        this.fileDocumentGenerateServiceDelegator = fileDocumentGenerateServiceDelegator;
    }

    @Override
    protected FileDTO generateDocument(Long taskId, DecisionNotification decisionNotification) {
        final RequestTask requestTask = requestTaskService.findTaskById(taskId);
        final DoeApplicationSubmitRequestTaskPayload taskPayload =
                (DoeApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        final Request request = requestTask.getRequest();
        final DoeRequestPayload requestPayload = (DoeRequestPayload) request.getPayload();

        final TemplateParams templateParams = previewOfficialNoticeService.generateCommonParams(request, decisionNotification);
        final Map<String, Object> params = this.constructParams(taskPayload, requestPayload);
        templateParams.getParams().putAll(params);

        boolean isSurrenderObligationType = taskPayload.getDoe().getMaritimeEmissions()
                .getTotalMaritimeEmissions().getDeterminationType().equals(DoeDeterminationType.SURRENDER_OBLIGATION);

        return isSurrenderObligationType ?
                fileDocumentGenerateServiceDelegator.generateFileDocument(
                        MrtmDocumentTemplateType.DOE_EFSN_SUBMITTED,
                        templateParams, EFSN_NOTICE_FILE_NAME) :
                fileDocumentGenerateServiceDelegator.generateFileDocument(
                        MrtmDocumentTemplateType.DOE_SUBMITTED,
                        templateParams, DOE_AND_EFSN_NOTICE_FILE_NAME);
    }

    @Override
    public List<String> getTypes() {
        return List.of(
                MrtmDocumentTemplateType.DOE_SUBMITTED,
                MrtmDocumentTemplateType.DOE_EFSN_SUBMITTED
        );
    }

    @Override
    protected List<String> getTaskTypes() {
        return List.of(MrtmRequestTaskType.DOE_APPLICATION_SUBMIT, MrtmRequestTaskType.DOE_APPLICATION_PEER_REVIEW);
    }

    private Map<String, Object> constructParams(DoeApplicationSubmitRequestTaskPayload taskPayload, DoeRequestPayload requestPayload) {
        Doe doe = taskPayload.getDoe();
        Year reportingYear = requestPayload.getReportingYear();

        Map<String, Object> vars = new HashMap<>();

        vars.put("reportingYear", reportingYear);
        vars.put("totalEmissions", doe.getMaritimeEmissions().getTotalMaritimeEmissions().getTotalReportableEmissions());
        vars.put("determinationReasonDescription",
                retrieveDeterminationReasonDescription(doe.getMaritimeEmissions().getDeterminationReason().getType(), reportingYear));
        vars.put("emissionsCalculationApproachDescription",
                doe.getMaritimeEmissions().getTotalMaritimeEmissions().getCalculationApproach());
        vars.put("smallIslandFerryDeduction",
                doe.getMaritimeEmissions().getTotalMaritimeEmissions().getSmallIslandFerryDeduction());
        vars.put("surrenderEmissions",
                doe.getMaritimeEmissions().getTotalMaritimeEmissions().getSurrenderEmissions());
        vars.put("iceClassDeduction",
                doe.getMaritimeEmissions().getTotalMaritimeEmissions().getIceClassDeduction());

        return vars;
    }

    private String retrieveDeterminationReasonDescription(DoeDeterminationReasonType doeDeterminationReasonType,
                                                          Year reportingYear) {
        return switch (doeDeterminationReasonType) {
            case VERIFIED_REPORT_NOT_SUBMITTED_IN_ACCORDANCE_WITH_ORDER ->
                    String.format(doeDeterminationReasonType.getDescription(), reportingYear.plusYears(1));
            case CORRECTING_NON_MATERIAL_MISSTATEMENT ->
                    String.format(doeDeterminationReasonType.getDescription(), reportingYear);
            case IMPOSING_OR_CONSIDERING_IMPOSING_CIVIL_PENALTY_IN_ACCORDANCE_WITH_ORDER ->
                    doeDeterminationReasonType.getDescription();
        };
    }
}
