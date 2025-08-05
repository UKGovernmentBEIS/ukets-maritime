package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;

import java.util.List;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpReissueUpdatePayloadConsolidationNumberServiceTest {

	@InjectMocks
	private EmpReissueUpdatePayloadConsolidationNumberService cut;

	@Mock
	private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
	
	@Test
	void updateRequestPayloadConsolidationNumber() {
		Long accountId = 1L;
		EmpReissueRequestPayload payload = EmpReissueRequestPayload.builder().build();
		Request request = Request.builder()
				.payload(payload)
				.requestResources(List.of(RequestResource.builder()
						.resourceId(accountId.toString())
						.resourceType(ResourceType.ACCOUNT)
						.build()))
				.build();
		
		when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanConsolidationNumberByAccountId(accountId)).thenReturn(10);
		
		cut.updateRequestPayloadConsolidationNumber(request);
		
		assertThat(payload.getConsolidationNumber()).isEqualTo(10);
		verify(emissionsMonitoringPlanQueryService, times(1)).getEmissionsMonitoringPlanConsolidationNumberByAccountId(accountId);
	}
}
