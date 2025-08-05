package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateWorkflowParamsProvider;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Stream;

@Component
public class EmpVariationApprovedDocumentTemplateWorkflowParamsProvider
        implements DocumentTemplateWorkflowParamsProvider<EmpVariationRequestPayload> {
    @Override
    public String getContextActionType() {
        return MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_ACCEPTED;
    }

    @Override
    public Map<String, Object> constructParams(EmpVariationRequestPayload payload) {
        final EmpAcceptedVariationDecisionDetails variationDecisionDetails = (EmpAcceptedVariationDecisionDetails) payload
                .getEmpVariationDetailsReviewDecision().getDetails();

        final TreeMap<EmpReviewGroup, EmpVariationReviewDecision> sortedDecisions = new TreeMap<>(
                payload.getReviewGroupDecisions());
        final List<String> reviewGroupsVariationScheduleItems = sortedDecisions
                .values()
                .stream()
                .filter(empVariationReviewDecision -> empVariationReviewDecision.getType() == EmpVariationReviewDecisionType.ACCEPTED)
                .map(EmpVariationReviewDecision::getDetails)
                .map(EmpAcceptedVariationDecisionDetails.class::cast)
                .map(EmpAcceptedVariationDecisionDetails::getVariationScheduleItems)
                .flatMap(List::stream)
                .toList();

        return Map.of(
                "empConsolidationNumber", payload.getEmpConsolidationNumber(),
                "variationScheduleItems", Stream.concat(variationDecisionDetails.getVariationScheduleItems().stream(),
                                reviewGroupsVariationScheduleItems.stream())
                        .toList()
        );
    }
}
