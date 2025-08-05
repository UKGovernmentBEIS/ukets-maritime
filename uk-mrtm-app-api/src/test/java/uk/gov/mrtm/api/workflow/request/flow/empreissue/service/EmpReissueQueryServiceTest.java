package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpReissueQueryServiceTest {

	@InjectMocks
	private EmpReissueQueryService cut;

	@Mock
	private RequestService requestService;
	
	@Test
	void getBatchRequest() {
		EmpReissueRequestMetadata metadata = EmpReissueRequestMetadata.builder()
    			.batchRequestId("empBatchRequestId")
    			.build();
		
		Request permitReissueRequest = Request.builder()
				.type(RequestType.builder().code(MrtmRequestType.EMP_REISSUE).build())
				.metadata(metadata)
				.build();
		
		Request batchRequest = Request.builder()
				.type(RequestType.builder().code(MrtmRequestType.EMP_BATCH_REISSUE).build())
				.build();
		
		when(requestService.findRequestById("empBatchRequestId")).thenReturn(batchRequest);
		
		Request result = cut.getBatchRequest(permitReissueRequest);
		
		assertThat(result).isEqualTo(batchRequest);
		verify(requestService, times(1)).findRequestById("empBatchRequestId");
	}
}
