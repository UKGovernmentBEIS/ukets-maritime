package uk.gov.mrtm.api.workflow.request.flow.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uk.gov.mrtm.api.account.domain.dto.MrtmDocumentTemplateAccountData;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentGenerationContextType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentTemplateEmpParamsSourceData;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateStage;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateGeneratorParamConstants;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class EmpCreateDocumentService {

    private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;
    private final DocumentTemplateEmpParamsProvider documentTemplateEmpParamsProvider;

    //TODO reduce number of arguments
	public String generateDocumentAsyncConvert(final Request request,
			final Long requestTaskId,
			final String signatory,
			final EmissionsMonitoringPlanDTO empDto, 
			final String documentTemplateType,
			final DocumentTemplateStage stage,
			final List<EmpVariationRequestInfo> empVariationRequestInfo, 
			final LocalDateTime empSubmissionDate,
			final LocalDateTime empEndDate, 
			final MrtmDocumentTemplateAccountData accountData,
			final DocumentGenerationContextType contextType) {
		final EmissionsMonitoringPlanContainer empContainer = empDto.getEmpContainer();
		final TemplateParams empParams = documentTemplateEmpParamsProvider.constructTemplateParams(
                DocumentTemplateEmpParamsSourceData.builder()
                .request(request)
                .signatory(signatory)
                .empContainer(empContainer)
                .variationRequestInfoList(empVariationRequestInfo)
                .consolidationNumber(empDto.getConsolidationNumber())
                .empSubmissionDate(empSubmissionDate)
                .empEndDate(empEndDate)
                .accountData(accountData)
                .build());

		Map<String, String> documentMetadata = Stream.of(
		        Map.entry(DocumentTemplateGeneratorParamConstants.CONTEXT_TYPE, contextType.name()),
		        Map.entry(DocumentTemplateGeneratorParamConstants.REQUEST_ID, request.getId().toString()),
		        requestTaskId != null
		                ? Map.entry(DocumentTemplateGeneratorParamConstants.REQUEST_TASK_ID, requestTaskId.toString())
		                : null,
		        Map.entry(DocumentTemplateGeneratorParamConstants.FILE_TYPE, RequestGeneratedFileType.EMP.name()),
		        Map.entry(DocumentTemplateGeneratorParamConstants.FILE_NAME, constructFileName(empDto, stage)),
		        Map.entry(DocumentTemplateGeneratorParamConstants.DOCUMENT_TEMPLATE_STAGE, stage.name())
		)
		.filter(Objects::nonNull)
		.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
		
		return fileDocumentGenerateServiceDelegator.generateDocumentAsyncConvert(documentTemplateType,
				empParams, documentMetadata);
	}

    private String constructFileName(final EmissionsMonitoringPlanDTO empDto) {
        return empDto.getId() + " v" + empDto.getConsolidationNumber() + ".pdf";
    }

    private String constructFileName(final EmissionsMonitoringPlanDTO empDto, final DocumentTemplateStage stage) {
        if (stage == DocumentTemplateStage.PREVIEW) {
            return "emissions_monitoring_plan_preview.pdf";
        }
        return constructFileName(empDto);
    }
}
