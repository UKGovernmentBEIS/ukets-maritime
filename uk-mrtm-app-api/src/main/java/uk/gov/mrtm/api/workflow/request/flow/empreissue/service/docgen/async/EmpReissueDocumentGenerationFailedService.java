package uk.gov.mrtm.api.workflow.request.flow.empreissue.service.docgen.async;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Log4j2
@Service
@RequiredArgsConstructor
public class EmpReissueDocumentGenerationFailedService {
	
	private final RequestService requestService;
	private final EmpReissueDocumentGenerationSendCompletedEventService sendEventService;
	
	@Transactional
	public void failed(String requestId, RequestGeneratedFileType fileType) {
		final Request request = requestService.findRequestById(requestId);
		final EmpReissueRequestPayload requestPayload = (EmpReissueRequestPayload) request.getPayload();
		
		switch (fileType) {
		case EMP:
			requestPayload.setDocumentSucceed(false);
			break;
		case OFFICIAL_NOTICE:
			requestPayload.setOfficialNoticeSucceed(false);
			break;
		default:
			throw new UnsupportedOperationException(fileType.name());
		}
		
		sendEventService.sendEventIfAllDocsCompleted(requestId);
	}
}
