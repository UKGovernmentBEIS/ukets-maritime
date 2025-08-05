package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpReissueDoReissueServiceTest {

	@InjectMocks
	private EmpReissueDoReissueService cut;

	@Mock
	private RequestService requestService;
	
	@Mock
	private EmissionsMonitoringPlanService emissionsMonitoringPlanService;
	
	@Mock
	private EmpReissueUpdatePayloadConsolidationNumberService empReissueUpdatePayloadConsolidationNumberService;
	
	@Mock
	private EmpReissueGenerateDocumentsService empReissueGenerateDocumentsService;
	
	@Mock
	private EmpReissueAddCompletedRequestActionService empReissueAddCompletedRequestActionService;
	
	@Mock
	private EmpReissueOfficialNoticeService empReissueOfficialNoticeService;

	@Test
	void doReissue() {
		String requestId = "1";
		Long accountId = 1L;
		EmpReissueRequestMetadata metadata = new EmpReissueRequestMetadata(); // Create metadata object

		Request request = Request.builder()
				.type(RequestType.builder().code(MrtmRequestType.EMP_REISSUE).build())
				.requestResources(List.of(RequestResource.builder()
						.resourceId(accountId.toString())
						.resourceType(ResourceType.ACCOUNT)
						.build()))
				.metadata(metadata) // Set metadata here
				.build();

		when(requestService.findRequestById(requestId)).thenReturn(request);
		when(emissionsMonitoringPlanService.incrementEmpConsolidationNumber(accountId)).thenReturn(1); // Mock return value

		cut.doReissue(requestId);

		assertThat(request.getSubmissionDate()).isNotNull();
		assertThat(metadata.getEmpConsolidationNumber()).isEqualTo(1); // Validate metadata is updated

		verify(requestService, times(1)).findRequestById(requestId);
		verify(emissionsMonitoringPlanService, times(1)).incrementEmpConsolidationNumber(accountId);
		verify(empReissueUpdatePayloadConsolidationNumberService, times(1)).updateRequestPayloadConsolidationNumber(request);
		verify(empReissueGenerateDocumentsService, times(1)).generateDocuments(request);
		verify(empReissueAddCompletedRequestActionService, times(1)).add(requestId);
		verify(empReissueOfficialNoticeService, times(1)).sendOfficialNotice(request);
	}
}
