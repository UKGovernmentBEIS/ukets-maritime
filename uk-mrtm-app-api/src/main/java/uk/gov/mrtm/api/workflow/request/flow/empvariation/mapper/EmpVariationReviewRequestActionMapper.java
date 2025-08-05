package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRejectedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.netz.api.common.config.MapperConfig;

import java.util.AbstractMap;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpVariationReviewRequestActionMapper {

	@Mapping(target = "determination.reason", ignore = true)
	@Mapping(target = "fileDocuments", ignore = true)
	@Mapping(target = "empVariationDetailsReviewDecision", source = "empVariationDetailsReviewDecision", qualifiedByName = "approvedVariationDetailsReviewDecisionWithoutNotes")
    @Mapping(target = "reviewGroupDecisions", source = "reviewGroupDecisions", qualifiedByName = "approvedReviewGroupDecisionsWithoutNotes")
    EmpVariationApplicationApprovedRequestActionPayload cloneApprovedPayloadIgnoreReasonAndDecisionsNotes(
        EmpVariationApplicationApprovedRequestActionPayload payload);
	
	@Named("approvedVariationDetailsReviewDecisionWithoutNotes")
    default EmpVariationReviewDecision setApprovedVariationDetailsReviewDecisionWithoutNotes(
    		EmpVariationReviewDecision variationDetailsReviewDecision) {
    	return cloneGrantedDecisionWithoutNotes(variationDetailsReviewDecision);
    }
    
    @Named("approvedReviewGroupDecisionsWithoutNotes")
    default Map<EmpReviewGroup, EmpVariationReviewDecision> setApprovedReviewGroupDecisionsWithoutNotes(
            Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions) {
    	return reviewGroupDecisions.entrySet().stream()
                .map(entry ->
                        new AbstractMap.SimpleEntry<>(entry.getKey(),
                        		cloneGrantedDecisionWithoutNotes(entry.getValue()))
                ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
    
    private EmpVariationReviewDecision cloneGrantedDecisionWithoutNotes(EmpVariationReviewDecision variationReviewDecision) {
		return EmpVariationReviewDecision.builder()
                .type(variationReviewDecision.getType())
                .details(EmpAcceptedVariationDecisionDetails.builder()
                		.variationScheduleItems(((EmpAcceptedVariationDecisionDetails)variationReviewDecision.getDetails()).getVariationScheduleItems())
                		.build())
                .build();
    }

    @Mapping(target = "determination.reason", ignore = true)
    EmpVariationApplicationDeemedWithdrawnRequestActionPayload cloneDeemedWithdrawnPayloadIgnoreReason(
        EmpVariationApplicationDeemedWithdrawnRequestActionPayload payload);
    
    @Mapping(target = "determination.reason", ignore = true)
    EmpVariationApplicationRejectedRequestActionPayload cloneRejectedPayloadIgnoreReason(
        EmpVariationApplicationRejectedRequestActionPayload payload);
}
