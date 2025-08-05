package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRegulatorLedApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRejectedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationChangeType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReasonType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class EmpVariationReviewRequestActionMapperTest {

	private final EmpVariationReviewRequestActionMapper requestActionMapper = Mappers.getMapper(EmpVariationReviewRequestActionMapper.class);

	private final EmpVariationSubmitRegulatorLedMapper mapper = Mappers.getMapper(EmpVariationSubmitRegulatorLedMapper.class);

    @Test
    void cloneApprovedPayloadIgnoreReasonAndDecisions() {
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder().build();
        EmpVariationDetermination determination = EmpVariationDetermination.builder()
            .type(EmpVariationDeterminationType.APPROVED)
            .reason("reason")
            .build();
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = Map.of(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS, EmpVariationReviewDecision.builder()
    		.type(EmpVariationReviewDecisionType.ACCEPTED)
    		.details(EmpAcceptedVariationDecisionDetails.builder()
    				.notes("notes1")
    				.variationScheduleItems(List.of("item1", "item2"))
    				.build())
    		.build()
        );
        EmpVariationReviewDecision detailsReviewDecision = EmpVariationReviewDecision
        		.builder()
        		.type(EmpVariationReviewDecisionType.ACCEPTED)
        		.build();
        EmpVariationApplicationApprovedRequestActionPayload requestActionPayload =
            EmpVariationApplicationApprovedRequestActionPayload.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empVariationDetailsReviewDecision(detailsReviewDecision)
                .determination(determination)
                .reviewGroupDecisions(reviewGroupDecisions)
                .empVariationDetailsReviewDecision(EmpVariationReviewDecision.builder()
                		.type(EmpVariationReviewDecisionType.ACCEPTED)
                		.details(EmpAcceptedVariationDecisionDetails.builder()
                				.notes("notes3")
                				.variationScheduleItems(List.of("item3", "item4"))
                				.build())
                		.build())
                .empDocument(FileInfoDTO.builder()
                		.uuid(UUID.randomUUID().toString())
                		.name("emp document name")
                		.build())
                .officialNotice(FileInfoDTO.builder()
                		.uuid(UUID.randomUUID().toString())
                		.name("approved official notice name")
                		.build())
                .build();

        EmpVariationApplicationApprovedRequestActionPayload clonedRequestActionPayload =
            requestActionMapper.cloneApprovedPayloadIgnoreReasonAndDecisionsNotes(requestActionPayload);

        assertEquals(emissionsMonitoringPlan, clonedRequestActionPayload.getEmissionsMonitoringPlan());
        assertThat(clonedRequestActionPayload.getReviewGroupDecisions()).containsExactlyEntriesOf(Map.of(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS, EmpVariationReviewDecision.builder()
    		.type(EmpVariationReviewDecisionType.ACCEPTED)
    		.details(EmpAcceptedVariationDecisionDetails.builder()
    				.variationScheduleItems(List.of("item1", "item2"))
    				.build())
    		.build()
        ));
        assertThat(clonedRequestActionPayload.getEmpVariationDetailsReviewDecision()).isEqualTo(EmpVariationReviewDecision.builder()
                		.type(EmpVariationReviewDecisionType.ACCEPTED)
                		.details(EmpAcceptedVariationDecisionDetails.builder()
                				.variationScheduleItems(List.of("item3", "item4"))
                				.build())
                		.build());

        EmpVariationDetermination clonedRequestActionPayloadDetermination = clonedRequestActionPayload.getDetermination();
        assertEquals(determination.getType(), clonedRequestActionPayloadDetermination.getType());
        assertNull(clonedRequestActionPayloadDetermination.getReason());
    }

    @Test
    void cloneDeemedWithdrawnPayloadIgnoreReason() {
    	EmpVariationDetermination determination = EmpVariationDetermination.builder()
            .type(EmpVariationDeterminationType.DEEMED_WITHDRAWN)
            .reason("reason")
            .build();
        EmpVariationApplicationDeemedWithdrawnRequestActionPayload requestActionPayload =
        		EmpVariationApplicationDeemedWithdrawnRequestActionPayload.builder()
                .determination(determination)
                .officialNotice(FileInfoDTO.builder()
                		.uuid(UUID.randomUUID().toString())
                		.name("withdrawn official notice name")
                		.build())
                .build();

        EmpVariationApplicationDeemedWithdrawnRequestActionPayload clonedRequestActionPayload =
            requestActionMapper.cloneDeemedWithdrawnPayloadIgnoreReason(requestActionPayload);

        EmpVariationDetermination clonedRequestActionPayloadDetermination = clonedRequestActionPayload.getDetermination();
        assertEquals(determination.getType(), clonedRequestActionPayloadDetermination.getType());
        assertNull(clonedRequestActionPayloadDetermination.getReason());
    }
    
    @Test
    void clonRejectedPayloadIgnoreReason() {
    	EmpVariationDetermination determination = EmpVariationDetermination.builder()
            .type(EmpVariationDeterminationType.REJECTED)
            .reason("reason")
            .build();
    	EmpVariationApplicationRejectedRequestActionPayload requestActionPayload =
    			EmpVariationApplicationRejectedRequestActionPayload.builder()
                .determination(determination)
                .officialNotice(FileInfoDTO.builder()
                		.uuid(UUID.randomUUID().toString())
                		.name("rejected official notice name")
                		.build())
                .build();

        EmpVariationApplicationRejectedRequestActionPayload clonedRequestActionPayload =
            requestActionMapper.cloneRejectedPayloadIgnoreReason(requestActionPayload);

        EmpVariationDetermination clonedRequestActionPayloadDetermination = clonedRequestActionPayload.getDetermination();
        assertEquals(determination.getType(), clonedRequestActionPayloadDetermination.getType());
        assertNull(clonedRequestActionPayloadDetermination.getReason());
    }
    
    @Test
    void cloneApprovedPayloadIgnoreReasonAndDecisionsNotes() {
    	EmpVariationApplicationApprovedRequestActionPayload sourcePayload = EmpVariationApplicationApprovedRequestActionPayload.builder()
    			.determination(EmpVariationDetermination.builder()
    					.type(EmpVariationDeterminationType.APPROVED)
    					.reason("reason should be ignored")
    					.build())
    			.empVariationDetailsReviewDecision(EmpVariationReviewDecision.builder()
    					.type(EmpVariationReviewDecisionType.ACCEPTED)
    					.details(EmpAcceptedVariationDecisionDetails.builder()
    							.variationScheduleItems(List.of("item1", "item2"))
    							.notes("notes should be ignored")
    							.build())
    					.build())
    			.reviewGroupDecisions(Map.of(
    						EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpVariationReviewDecision.builder()
        					.type(EmpVariationReviewDecisionType.ACCEPTED)
        					.details(EmpAcceptedVariationDecisionDetails.builder()
        							.variationScheduleItems(List.of("item3", "item4"))
        							.notes("add notes should be ignored")
        							.build())
        					.build()
    					))
    			.emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
    					.abbreviations(EmpAbbreviations.builder()
    							.exist(false)
    							.build())
    					.build())
    			.payloadType(MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_APPROVED_PAYLOAD)
    			.build();
    	
    	EmpVariationApplicationApprovedRequestActionPayload result = requestActionMapper.cloneApprovedPayloadIgnoreReasonAndDecisionsNotes(sourcePayload);
    	
    	assertThat(result.getDetermination()).isEqualTo(EmpVariationDetermination.builder()
    				.type(EmpVariationDeterminationType.APPROVED)
    					.build());
    	
    	assertThat(result.getEmpVariationDetailsReviewDecision()).isEqualTo(EmpVariationReviewDecision.builder()
				.type(EmpVariationReviewDecisionType.ACCEPTED)
				.details(EmpAcceptedVariationDecisionDetails.builder()
						.variationScheduleItems(List.of("item1", "item2"))
						.build())
				.build());
    	
    	assertThat(result.getReviewGroupDecisions()).containsExactlyEntriesOf(Map.of(
    			EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpVariationReviewDecision.builder()
    			.type(EmpVariationReviewDecisionType.ACCEPTED)
        					.details(EmpAcceptedVariationDecisionDetails.builder()
        							.variationScheduleItems(List.of("item3", "item4"))
        							.build())
        					.build()));
    	
    	assertThat(result.getEmissionsMonitoringPlan()).isEqualTo(sourcePayload.getEmissionsMonitoringPlan());
    }

	@Test
	void cloneRegulatorLedApprovedPayloadIgnoreDecisionNotes() {
		EmpVariationApplicationRegulatorLedApprovedRequestActionPayload source = EmpVariationApplicationRegulatorLedApprovedRequestActionPayload
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
				.reasonRegulatorLed(EmpVariationRegulatorLedReason.builder().type(EmpVariationRegulatorLedReasonType.OTHER).reasonOtherSummary("other").build())
				.build();

		EmpVariationApplicationRegulatorLedApprovedRequestActionPayload result = mapper.cloneRegulatorLedApprovedPayloadIgnoreDecisionNotes(source);

		assertThat(result.getEmissionsMonitoringPlan()).isEqualTo(source.getEmissionsMonitoringPlan());
		assertThat(result.getEmpVariationDetails()).isEqualTo(source.getEmpVariationDetails());
		assertThat(result.getDecisionNotification()).isEqualTo(source.getDecisionNotification());
		assertThat(result.getReasonRegulatorLed()).isEqualTo(source.getReasonRegulatorLed());
		assertThat(result.getReviewGroupDecisions()).containsExactlyEntriesOf(Map.of(
				EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpAcceptedVariationDecisionDetails.builder()
						.variationScheduleItems(List.of("item1", "item2"))
						.build()
		));
	}
}
