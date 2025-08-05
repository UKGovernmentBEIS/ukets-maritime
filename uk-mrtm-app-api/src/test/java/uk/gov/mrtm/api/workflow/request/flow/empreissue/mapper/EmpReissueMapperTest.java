package uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpReissueAccountReport;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueAccountDetails;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class EmpReissueMapperTest {

	private final EmpReissueMapper cut = Mappers.getMapper(EmpReissueMapper.class);

    @Test
    void toEmpReissueAccountReport() {
    	EmpReissueAccountDetails accountDetails = EmpReissueAccountDetails.builder()
    			.accountName("accountName1")
    			.empId("empId1")
    			.build();
    	
    	EmpEmpReissueAccountReport result = cut.toEmpReissueAccountReport(accountDetails);
    	
    	assertThat(result).isEqualTo(EmpEmpReissueAccountReport.builder()
    			.accountName("accountName1")
    			.empId("empId1")
    			.build());
    }
    
    @Test
    void toEmpReissueAccountsReports() {
    	EmpReissueAccountDetails accountDetails = EmpReissueAccountDetails.builder()
    			.accountName("accountName1")
    			.empId("empId1")
    			.build();
    	
    	Map<Long, EmpReissueAccountDetails> accountsDetails = Map.of(
    			1L, accountDetails
    			);
    	
    	Map<Long, EmpEmpReissueAccountReport> result = cut.toEmpReissueAccountsReports(accountsDetails);
    	
    	assertThat(result).isEqualTo(
    		Map.of(1L, 
    				EmpEmpReissueAccountReport.builder()
    			.accountName("accountName1")
    			.empId("empId1")
    			.build()));
    }

	@Test
	void toCompletedActionPayload() {
		FileInfoDTO officialNotice = FileInfoDTO.builder()
			.name("off").uuid(UUID.randomUUID().toString())
			.build();
		FileInfoDTO permitDocument = FileInfoDTO.builder()
			.name("permitDocument").uuid(UUID.randomUUID().toString())
			.build();
		EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
			.payloadType(MrtmRequestPayloadType.EMP_REISSUE_REQUEST_PAYLOAD)
			.officialNotice(officialNotice)
			.document(permitDocument)
			.summary("summary")
			.build();

		EmpReissueRequestMetadata metadata = EmpReissueRequestMetadata.builder()
			.submitter("submitter")
			.submitterId("submitterId")
			.signatory("signatory")
			.batchRequestId("permitBatchRequestId")
			.summary("summary")
			.build();

		EmpReissueCompletedRequestActionPayload result = cut.toCompletedActionPayload(requestPayload, metadata,
			"signatoryName", MrtmRequestActionPayloadType.EMP_REISSUE_COMPLETED_PAYLOAD);

		assertThat(result).isEqualTo(EmpReissueCompletedRequestActionPayload.builder()
			.payloadType(MrtmRequestActionPayloadType.EMP_REISSUE_COMPLETED_PAYLOAD)
			.officialNotice(officialNotice)
			.document(permitDocument)
			.signatory("signatory")
			.signatoryName("signatoryName")
			.submitter("submitter")
			.summary("summary")
			.build());
	}

}
