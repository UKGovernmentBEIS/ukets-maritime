package uk.gov.mrtm.api.workflow.request.flow.empreissue.service.docgen.async;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@ExtendWith(MockitoExtension.class)
class EmpReissueDocumentGenerationFailedServiceTest {

    @InjectMocks
    private EmpReissueDocumentGenerationFailedService cut;

	@Mock
    private RequestService requestService;

    @Mock
    private EmpReissueDocumentGenerationSendCompletedEventService sendEventService;

    @Test
    void failed_emp() {
    	String requestId = "Reqid";
    	RequestGeneratedFileType fileType = RequestGeneratedFileType.EMP;
    	
    	EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
				.build();
    	Request request = Request.builder()
				.payload(requestPayload)
				.build();
    	
    	when(requestService.findRequestById(requestId)).thenReturn(request);
    	
        cut.failed(requestId, fileType);

        assertFalse(requestPayload.getDocumentSucceed());
        assertNull(requestPayload.getOfficialNoticeSucceed());

        verify(requestService).findRequestById(requestId);
        verify(sendEventService).sendEventIfAllDocsCompleted(requestId);
    }
    
    @Test
    void failed_official_notice() {
    	String requestId = "Reqid";
    	RequestGeneratedFileType fileType = RequestGeneratedFileType.OFFICIAL_NOTICE;
    	
    	EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
				.build();
    	Request request = Request.builder()
				.payload(requestPayload)
				.build();
    	
    	when(requestService.findRequestById(requestId)).thenReturn(request);
    	
        cut.failed(requestId, fileType);

        assertNull(requestPayload.getDocumentSucceed());
        assertFalse(requestPayload.getOfficialNoticeSucceed());

        verify(requestService).findRequestById(requestId);
        verify(sendEventService).sendEventIfAllDocsCompleted(requestId);
    }

}
