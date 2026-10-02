package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.mrtm.api.account.domain.dto.MrtmDocumentTemplateAccountData;
import uk.gov.mrtm.api.common.config.RegistryConfig;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentGenerationContextType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.MrtmDocumentTemplateAccountDataCollectFromAccountService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service.EmpOfficialNoticeSendService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateStage;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateGeneratorParamConstants;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateOfficialNoticeParamsProvider;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateParamsSourceData;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName.EMP_APPROVED_TEMPLATE;

@Service
@RequiredArgsConstructor
public class EmpReissueOfficialNoticeService {

	private final DocumentTemplateOfficialNoticeParamsProvider documentTemplateOfficialNoticeParamsProvider;
	private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;
	private final EmpOfficialNoticeSendService empOfficialNoticeSendService;
	private final RegistryConfig registryConfig;
	private final MrtmDocumentTemplateAccountDataCollectFromAccountService accountTemplateDataFromAccountService;

	@Transactional
    public String generateOfficialNotice(final Request request) {
        final EmpReissueRequestMetadata requestMetadata = (EmpReissueRequestMetadata) request.getMetadata();

        final MrtmDocumentTemplateAccountData accountData = accountTemplateDataFromAccountService
				.collect(request.getAccountId());
        
        TemplateParams templateParams = documentTemplateOfficialNoticeParamsProvider
				.constructTemplateParams(DocumentTemplateParamsSourceData.builder()
						.contextActionType(MrtmDocumentTemplateGenerationContextActionType.EMP_REISSUE)
						.request(request)
						.signatory(requestMetadata.getSignatory())
						.accountData(accountData)
						.build());
        
        final Map<String, String> documentMetadata = Map.of(
        		DocumentTemplateGeneratorParamConstants.CONTEXT_TYPE, DocumentGenerationContextType.EMP_REISSUE.name(),
        		DocumentTemplateGeneratorParamConstants.REQUEST_ID, request.getId(),
				DocumentTemplateGeneratorParamConstants.FILE_TYPE, RequestGeneratedFileType.OFFICIAL_NOTICE.name(),
				DocumentTemplateGeneratorParamConstants.FILE_NAME, "Batch_variation_notice_maritime.pdf",
				DocumentTemplateGeneratorParamConstants.DOCUMENT_TEMPLATE_STAGE, DocumentTemplateStage.FINAL.name()
				); 
        
        return fileDocumentGenerateServiceDelegator.generateDocumentAsyncConvert(MrtmDocumentTemplateType.EMP_REISSUE,
				templateParams, documentMetadata);
    }
	
	public void sendOfficialNotice(final Request request) {
        final EmpReissueRequestPayload requestPayload = (EmpReissueRequestPayload) request.getPayload();
		empOfficialNoticeSendService.sendOfficialNotice(
			List.of(requestPayload.getOfficialNotice()), List.of(requestPayload.getDocument()),
			request, Collections.emptyList(), List.of(registryConfig.getEmail()), EMP_APPROVED_TEMPLATE);
	}
}
