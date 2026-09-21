package uk.gov.mrtm.api.workflow.request.flow.empreissue.service.docgen.async;

import java.util.Map;

import org.springframework.core.annotation.Order;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentGenerationContextType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateGeneratorParamConstants;
import uk.gov.netz.docgenerator.client.ConversionResultHandler;
import uk.gov.netz.docgenerator.client.model.ConversionEvent;

@Log4j2
@Service
@Order(200)
@RequiredArgsConstructor
public class EmpReissueDocumentGenerationConversionResultHandler implements ConversionResultHandler {
	
	private final EmpReissueDocumentGenerationCompletedService completedService;
	private final EmpReissueDocumentGenerationFailedService failedService;
	
	@Override
    @Retryable(
        retryFor = ObjectOptimisticLockingFailureException.class,
        maxAttempts = 3
    )
	public void handle(ConversionEvent event) {
		final Map<String, String> documentMetadata = event.getMetadata();
		
		final DocumentGenerationContextType contextType = DocumentGenerationContextType
				.valueOf(documentMetadata.get(DocumentTemplateGeneratorParamConstants.CONTEXT_TYPE));
		
		if(!DocumentGenerationContextType.EMP_REISSUE.equals(contextType)) {
			return;
		}
		
		final String requestId = documentMetadata.get(DocumentTemplateGeneratorParamConstants.REQUEST_ID);
		final RequestGeneratedFileType fileType = RequestGeneratedFileType
				.valueOf(documentMetadata.get(DocumentTemplateGeneratorParamConstants.FILE_TYPE));
		final String fileName = documentMetadata.get(DocumentTemplateGeneratorParamConstants.FILE_NAME);
		
		try {
			final String jobId = event.getJobId();
			
			final FileInfoDTO fileInfoDTO = FileInfoDTO.builder()
					.name(fileName)
					.uuid(jobId)
					.build();
			
			completedService.completed(requestId, fileType, event.getStatus(), fileInfoDTO);
		} catch (ObjectOptimisticLockingFailureException ole) {
			throw ole;
		} catch (Exception e) {
			log.error("Unexpected execution occurred for jobId {}", event.getJobId(), e);
			failedService.failed(requestId, fileType);
		}
		
	}

}
