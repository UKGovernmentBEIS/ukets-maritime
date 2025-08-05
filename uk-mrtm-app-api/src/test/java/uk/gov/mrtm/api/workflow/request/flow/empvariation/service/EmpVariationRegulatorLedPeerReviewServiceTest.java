package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationChangeType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReasonType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@ExtendWith(MockitoExtension.class)
class EmpVariationRegulatorLedPeerReviewServiceTest {

	@InjectMocks
    private EmpVariationRegulatorLedPeerReviewService cut;
	
	@Test
	void saveRequestPeerReviewAction() {
		UUID att1 = UUID.randomUUID();
		EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
				.abbreviations(EmpAbbreviations.builder().exist(true).build())
				.operatorDetails(EmpOperatorDetails.builder()
						.operatorName("opName1")
						.build())
				.build();
		EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload requestTaskPayload = EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload
				.builder()
				.reasonRegulatorLed(EmpVariationRegulatorLedReason.builder()
						.type(EmpVariationRegulatorLedReasonType.FOLLOWING_IMPROVING_REPORT)
						.build())
				.emissionsMonitoringPlan(emp)
				.empVariationDetails(EmpVariationDetails.builder()
						.reason("detailsReason")
						.changes(List.of(EmpVariationChangeType.CHANGE_MONITORING_METHOD))
						.build())
				.empAttachments(Map.of(att1, "att1.pdf"))
				.empSectionsCompleted(Map.of("section1", "completed"))
				.empVariationDetailsCompleted("true")
				.reviewGroupDecisions(Map.of(
    					EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpAcceptedVariationDecisionDetails.builder().build()
    					))
				.build();
		
		String selectedPeerReviewer = "peerReviewr";
		String userId = "userId";
		
		EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
				.build();
		Request request = Request.builder().payload(requestPayload).build();
		
		RequestTask requestTask = RequestTask.builder()
				.payload(requestTaskPayload)
				.request(request)
				.build();
		
		cut.saveRequestPeerReviewAction(requestTask, selectedPeerReviewer, userId);
		
		assertThat(requestPayload.getRegulatorPeerReviewer()).isEqualTo(selectedPeerReviewer);
		assertThat(requestPayload.getRegulatorReviewer()).isEqualTo(userId);
		assertThat(requestPayload.getEmissionsMonitoringPlan()).isEqualTo(emp);
		assertThat(requestPayload.getEmpVariationDetails()).isEqualTo(requestTaskPayload.getEmpVariationDetails());
		assertThat(requestPayload.getEmpAttachments()).isEqualTo(requestTaskPayload.getEmpAttachments());
		assertThat(requestPayload.getEmpSectionsCompleted()).isEqualTo(requestTaskPayload.getEmpSectionsCompleted());
		assertThat(requestPayload.getEmpVariationDetailsCompleted()).isEqualTo(requestTaskPayload.getEmpVariationDetailsCompleted());
		assertThat(requestPayload.getReviewGroupDecisionsRegulatorLed()).isEqualTo(requestTaskPayload.getReviewGroupDecisions());
		assertThat(requestPayload.getReasonRegulatorLed()).isEqualTo(requestTaskPayload.getReasonRegulatorLed());
	}
}
