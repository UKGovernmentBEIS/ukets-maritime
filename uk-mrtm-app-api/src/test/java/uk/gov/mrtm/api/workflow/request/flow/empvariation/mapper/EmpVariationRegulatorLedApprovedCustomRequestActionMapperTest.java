package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRegulatorLedApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationChangeType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationRegulatorLedApprovedCustomRequestActionMapperTest {
	
	@InjectMocks
    private EmpVariationRegulatorLedApprovedCustomRequestActionMapper cut;

    @Test
    void getUserRoleTypes() {
    	assertThat(cut.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.VERIFIER, RoleTypeConstants.OPERATOR);
    }
    
    @Test
    void getRequestActionType() {
    	assertThat(cut.getRequestActionType()).isEqualTo(MrtmRequestActionType.EMP_VARIATION_APPLICATION_REGULATOR_LED_APPROVED);
    }
    
    @Test
    void toRequestActionDTO() {
		EmpVariationApplicationRegulatorLedApprovedRequestActionPayload requestActionPayload = EmpVariationApplicationRegulatorLedApprovedRequestActionPayload
				.builder()
				.emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
						.abbreviations(EmpAbbreviations.builder()
								.exist(true)
								.build())
						.build())
				.empVariationDetails(EmpVariationDetails.builder()
						.reason("detailsReason")
						.changes(List.of(EmpVariationChangeType.CHANGE_MONITORING_METHOD))
						.build())
				.reviewGroupDecisions(Map.of(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpAcceptedVariationDecisionDetails.builder()
						.notes("notes")
						.variationScheduleItems(List.of("item1", "item2"))
						.build()))
				.decisionNotification(DecisionNotification.builder()
						.operators(Set.of("op1", "op2"))
						.build())
				.build();

		RequestAction requestAction = mock(RequestAction.class);
		Request request = mock(Request.class);

		when(requestAction.getRequest()).thenReturn(request);
		when(request.getAccountId()).thenReturn(1L);
		when(requestAction.getPayload()).thenReturn(requestActionPayload);

		RequestActionDTO result = cut.toRequestActionDTO(requestAction);
		
		assertThat(result.getId()).isEqualTo(requestAction.getId());
		EmpVariationApplicationRegulatorLedApprovedRequestActionPayload resultPayload = (EmpVariationApplicationRegulatorLedApprovedRequestActionPayload) result.getPayload();
		assertThat(resultPayload.getEmissionsMonitoringPlan()).isEqualTo(requestActionPayload.getEmissionsMonitoringPlan());
		assertThat(resultPayload.getReviewGroupDecisions()).containsExactlyEntriesOf(Map.of(
				EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpAcceptedVariationDecisionDetails.builder()
				.variationScheduleItems(List.of("item1", "item2"))
				.build()
				));
    }
    
}
