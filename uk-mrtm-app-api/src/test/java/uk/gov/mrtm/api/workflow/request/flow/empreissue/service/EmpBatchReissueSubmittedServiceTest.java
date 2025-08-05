package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpBatchReissueSubmittedServiceTest {

	@InjectMocks
    private EmpBatchReissueSubmittedService cut;
    
    @Mock
    private RequestService requestService;
    
    @Mock
	private RequestActionUserInfoResolver requestActionUserInfoResolver;
    
    @Test
    void batchReissueSubmitted() {
    	String requestId = "1";
    	
    	EmpBatchReissueRequestPayload requestPayload = EmpBatchReissueRequestPayload.builder()
    			.signatory("signatory")
    			.build();
    	
    	EmpBatchReissueRequestMetadata batchRequestMetadata = EmpBatchReissueRequestMetadata.builder()
    			.submitter("submitter")
    			.submitterId("submitterId")
    			.build();
    	
    	final Request request = Request.builder()
                .id(requestId)
                .payload(requestPayload)
                .metadata(batchRequestMetadata)
                .type(RequestType.builder().code(MrtmRequestType.EMP_BATCH_REISSUE).build())
                .build();
    	
    	when(requestService.findRequestById(requestId)).thenReturn(request);
    	when(requestActionUserInfoResolver.getUserFullName("signatory")).thenReturn("signatoryFullname");
    	
    	EmpBatchReissueSubmittedRequestActionPayload expectedActionPayload = EmpBatchReissueSubmittedRequestActionPayload.builder()
        		.payloadType(MrtmRequestActionPayloadType.EMP_BATCH_REISSUE_SUBMITTED_PAYLOAD)
        		.submitter("submitter")
        		.signatory("signatory")
        		.signatoryName("signatoryFullname")
        		.build();
    	
    	cut.batchReissueSubmitted(requestId);
    	
    	assertThat(request.getSubmissionDate()).isNotNull();
    	assertThat(batchRequestMetadata.getSubmissionDate()).isNotNull();
    	assertThat(request.getSubmissionDate().toLocalDate()).isEqualTo(batchRequestMetadata.getSubmissionDate());
        
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestActionUserInfoResolver, times(1)).getUserFullName("signatory");
        verify(requestService, times(1)).addActionToRequest(request, expectedActionPayload,
			MrtmRequestActionType.EMP_BATCH_REISSUE_SUBMITTED, "submitterId");
    }
}
