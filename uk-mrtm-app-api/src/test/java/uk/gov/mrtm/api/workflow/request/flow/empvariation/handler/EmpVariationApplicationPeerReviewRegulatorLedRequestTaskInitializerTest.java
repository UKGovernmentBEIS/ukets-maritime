package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpVariationApplicationPeerReviewRegulatorLedRequestTaskInitializerTest {

	@InjectMocks
    private EmpVariationApplicationPeerReviewRegulatorLedRequestTaskInitializer cut;
	
	@Test
	void getRequestTaskTypes() {
		assertThat(cut.getRequestTaskTypes()).containsExactly(MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW);
	}
	
	@Test
	void initializePayload() {
		EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
				.emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
						.abbreviations(EmpAbbreviations.builder()
								.exist(false)
								.build())
						.operatorDetails(EmpOperatorDetails.builder().build())
						.build())
				.empVariationDetails(EmpVariationDetails.builder()
						.reason("reason")
						.build())
				.build();
		
		Long accountId = 1L;
		String requestId = "1L";
		Request request = Request.builder().id(requestId).requestResources(List.of(RequestResource.builder()
			.resourceId(String.valueOf(accountId))
			.resourceType(ResourceType.ACCOUNT).build())).payload(requestPayload).build();


		RequestTaskPayload result = cut.initializePayload(request);
		assertThat(result).isInstanceOf(EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.class);
		assertThat(result).isEqualTo(EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
				.payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_PEER_REVIEW_REGULATOR_LED_PAYLOAD)
				.emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
						.abbreviations(EmpAbbreviations.builder()
								.exist(false)
								.build())
						.operatorDetails(EmpOperatorDetails.builder().build())
						.build())
				.empVariationDetails(EmpVariationDetails.builder()
						.reason("reason")
						.build())
				.build());
	}
}
