package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpReissueRequestIdGeneratorTest {

	@InjectMocks
	private EmpReissueRequestIdGenerator cut;

	@Test
	void generate() {
		Long accountId = 12L;
		EmpReissueRequestMetadata metadata = EmpReissueRequestMetadata.builder()
    			.submitter("submitter")
    			.submitterId("submitterId")
    			.signatory("signatory")
    			.batchRequestId("permitBatchRequestId")
    			.build();
		
		RequestParams params = RequestParams.builder()
				.requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
				.requestMetadata(metadata)
				.build();
		
		String result = cut.generate(params);
		
		assertThat(result).isEqualTo("B00012-permitBatchRequestId");
	}
	
	@Test
	void getTypes() {
		assertThat(cut.getTypes()).containsExactly(MrtmRequestType.EMP_REISSUE);
	}
	
	@Test
	void getPrefix() {
		assertThat(cut.getPrefix()).isEqualTo("B");
	}
	
}
