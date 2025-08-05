package uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpBatchReissueCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpReissueAccountReport;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class EmpBatchReissueMapperTest {

	private final EmpBatchReissueMapper cut = Mappers.getMapper(EmpBatchReissueMapper.class);

    @Test
    void toSubmittedActionPayload() {
    	EmpBatchReissueRequestPayload requestPayload = EmpBatchReissueRequestPayload.builder()
    			.signatory("signatory")
    			.build();
    	
    	EmpBatchReissueRequestMetadata metadata = EmpBatchReissueRequestMetadata.builder()
    			.type(MrtmRequestMetadataType.EMP_BATCH_REISSUE)
    			.submitter("submitter")
    			.build();
    	
    	String signatoryName = "signName";
    	
    	EmpBatchReissueSubmittedRequestActionPayload result = cut.toSubmittedActionPayload(requestPayload, metadata, signatoryName, MrtmRequestActionPayloadType.EMP_BATCH_REISSUE_SUBMITTED_PAYLOAD);
    	
    	assertThat(result).isEqualTo(EmpBatchReissueSubmittedRequestActionPayload.builder()
    			.payloadType(MrtmRequestActionPayloadType.EMP_BATCH_REISSUE_SUBMITTED_PAYLOAD)
    			.submitter("submitter")
    			.signatory("signatory")
    			.signatoryName(signatoryName)
    			.build());
    }
    
    @Test
    void toCompletedActionPayload() {
    	EmpBatchReissueRequestPayload requestPayload = EmpBatchReissueRequestPayload.builder()
    			.signatory("signatory")
				.summary("summary")
    			.build();
    	EmpBatchReissueRequestMetadata metadata = EmpBatchReissueRequestMetadata.builder()
    			.type(MrtmRequestMetadataType.EMP_BATCH_REISSUE)
    			.submitter("submitter")
				.summary("summary")
    			.accountsReports(Map.of(
    					1L, EmpEmpReissueAccountReport.builder().accountName("inst1").build(),
    					2L, EmpEmpReissueAccountReport.builder().accountName("inst2").build()
    					))
    			.build();  
    	String signatoryName = "signName";
    	
    	EmpEmpBatchReissueCompletedRequestActionPayload result = cut.toCompletedActionPayload(requestPayload, metadata, signatoryName, MrtmRequestActionPayloadType.EMP_BATCH_REISSUE_COMPLETED_PAYLOAD);
    	
    	assertThat(result).isEqualTo(EmpEmpBatchReissueCompletedRequestActionPayload.builder()
    			.payloadType(MrtmRequestActionPayloadType.EMP_BATCH_REISSUE_COMPLETED_PAYLOAD)
    			.submitter("submitter")
    			.signatory("signatory")
    			.signatoryName(signatoryName)
    			.numberOfAccounts(2)
				.summary("summary")
    			.build());
    }
}
