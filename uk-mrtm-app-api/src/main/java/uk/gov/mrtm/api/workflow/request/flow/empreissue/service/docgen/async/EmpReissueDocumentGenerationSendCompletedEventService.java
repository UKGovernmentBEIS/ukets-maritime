package uk.gov.mrtm.api.workflow.request.flow.empreissue.service.docgen.async;

import java.util.Map;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Log4j2
@Service
@RequiredArgsConstructor
class EmpReissueDocumentGenerationSendCompletedEventService {
	
	private final RequestService requestService;
	private final WorkflowService workflowService;
	
	@Transactional
	public void sendEventIfAllDocsCompleted(String requestId) {
		final Request request = requestService.findRequestById(requestId);
		final EmpReissueRequestPayload requestPayload = (EmpReissueRequestPayload) request.getPayload();
		
		if(requestPayload.getDocumentSucceed() != null && 
    			requestPayload.getOfficialNoticeSucceed() != null) {
			final boolean allSucceeded = BooleanUtils.isTrue(requestPayload.getDocumentSucceed())
					&& BooleanUtils.isTrue(requestPayload.getOfficialNoticeSucceed());
			workflowService.sendEvent(requestId, MrtmBpmnProcessConstants.DOCUMENT_FILE_GENERATED,
					Map.of(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED, allSucceeded,
							BpmnProcessConstants.REQUEST_DELETE_UPON_TERMINATE, !allSucceeded));
		}
	}
}
