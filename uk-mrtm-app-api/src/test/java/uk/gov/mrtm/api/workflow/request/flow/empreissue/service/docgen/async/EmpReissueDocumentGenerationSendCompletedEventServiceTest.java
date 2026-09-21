package uk.gov.mrtm.api.workflow.request.flow.empreissue.service.docgen.async;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@ExtendWith(MockitoExtension.class)
class EmpReissueDocumentGenerationSendCompletedEventServiceTest {

	@InjectMocks
	private EmpReissueDocumentGenerationSendCompletedEventService cut;

	@Mock
    private RequestService requestService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void sendEventIfAllDocsCompleted_not_send() {
    	String requestId = "Reqid";
    	
    	EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
				.build();
    	Request request = Request.builder()
				.payload(requestPayload)
				.build();
    	
    	when(requestService.findRequestById(requestId)).thenReturn(request);
    	
    	cut.sendEventIfAllDocsCompleted(requestId);
    	
    	verify(requestService).findRequestById(requestId);
    	verifyNoInteractions(workflowService);
    }
    
    @Test
    void sendEventIfAllDocsCompleted_send_failed() {
    	String requestId = "Reqid";
    	
    	EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
    			.documentSucceed(Boolean.FALSE)
    			.officialNoticeSucceed(Boolean.TRUE)
				.build();
    	Request request = Request.builder()
				.payload(requestPayload)
				.build();
    	
    	when(requestService.findRequestById(requestId)).thenReturn(request);
    	
    	cut.sendEventIfAllDocsCompleted(requestId);
    	
    	verify(requestService).findRequestById(requestId);
    	verify(workflowService, times(1)).sendEvent(requestId, MrtmBpmnProcessConstants.DOCUMENT_FILE_GENERATED, 
    			Map.of(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED, false,
						BpmnProcessConstants.REQUEST_DELETE_UPON_TERMINATE, true)
    			);
    }
    
    @Test
    void sendEventIfAllDocsCompleted_send_succeeded() {
    	String requestId = "Reqid";
    	
    	EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
    			.documentSucceed(Boolean.TRUE)
    			.officialNoticeSucceed(Boolean.TRUE)
				.build();
    	Request request = Request.builder()
				.payload(requestPayload)
				.build();
    	
    	when(requestService.findRequestById(requestId)).thenReturn(request);
    	
    	cut.sendEventIfAllDocsCompleted(requestId);
    	
    	verify(requestService).findRequestById(requestId);
    	verify(workflowService, times(1)).sendEvent(requestId, MrtmBpmnProcessConstants.DOCUMENT_FILE_GENERATED, 
    			Map.of(MrtmBpmnProcessConstants.EMP_REISSUE_REQUEST_SUCCEEDED, true,
						BpmnProcessConstants.REQUEST_DELETE_UPON_TERMINATE, false)
    			);
    }
}
