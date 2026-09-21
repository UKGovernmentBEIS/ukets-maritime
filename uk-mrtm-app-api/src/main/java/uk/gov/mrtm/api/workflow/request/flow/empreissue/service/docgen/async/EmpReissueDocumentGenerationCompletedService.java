package uk.gov.mrtm.api.workflow.request.flow.empreissue.service.docgen.async;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpDetailsDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentGenerationEventOutcome;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.files.documents.service.storage.FileDocumentStorageService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.docgenerator.client.DocumentGeneratorClient;

@Log4j2
@Service
@RequiredArgsConstructor
public class EmpReissueDocumentGenerationCompletedService {
	
	private final RequestService requestService;
	private final DocumentGeneratorClient documentGeneratorClient;
	private final FileDocumentStorageService fileDocumentStorageService;
	private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
	private final EmissionsMonitoringPlanService emissionsMonitoringPlanService;
	private final EmpReissueDocumentGenerationSendCompletedEventService sendEventService;
	
	@Transactional
	public void completed(String requestId, RequestGeneratedFileType fileType, String status, FileInfoDTO fileInfoDTO) {
		final Request request = requestService.findRequestByIdForUpdate(requestId);
		final EmpReissueRequestPayload requestPayload = (EmpReissueRequestPayload) request.getPayload();
		
		final byte[] bytes = documentGeneratorClient.downloadBytes(fileInfoDTO.getUuid());
		final FileInfoDTO fileDocumentDTO = fileDocumentStorageService.createFileDocumentWithUuid(bytes, fileInfoDTO.getName(),
				fileInfoDTO.getUuid());
		
    	switch (fileType) {
		case EMP:
			requestPayload.setDocument(fileDocumentDTO);
			requestPayload.setDocumentSucceed(DocumentGenerationEventOutcome.COMPLETE.name().equals(status));
			final EmpDetailsDTO empDetailsDTO = emissionsMonitoringPlanQueryService
					.getEmissionsMonitoringPlanDetailsDTOByAccountId(request.getAccountId())
					.orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
			emissionsMonitoringPlanService.setFileDocumentUuid(empDetailsDTO.getId(), fileDocumentDTO.getUuid());
			break;
		case OFFICIAL_NOTICE:
			requestPayload.setOfficialNotice(fileDocumentDTO);
			requestPayload.setOfficialNoticeSucceed(DocumentGenerationEventOutcome.COMPLETE.name().equals(status));
			break;
		default:
			throw new UnsupportedOperationException(fileType.name());
		}
    	
    	sendEventService.sendEventIfAllDocsCompleted(requestId);
	}
}
