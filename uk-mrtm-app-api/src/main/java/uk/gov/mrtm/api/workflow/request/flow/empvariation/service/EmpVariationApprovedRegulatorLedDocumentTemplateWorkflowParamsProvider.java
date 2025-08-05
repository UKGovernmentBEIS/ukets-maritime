package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateWorkflowParamsProvider;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Component
public class EmpVariationApprovedRegulatorLedDocumentTemplateWorkflowParamsProvider
        implements DocumentTemplateWorkflowParamsProvider<EmpVariationRequestPayload> {
    @Override
    public String getContextActionType() {
        return MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_REGULATOR_LED_APPROVED;
    }

    @Override
    public Map<String, Object> constructParams(EmpVariationRequestPayload payload) {
        final TreeMap<EmpReviewGroup, EmpAcceptedVariationDecisionDetails> sortedDecisions = new TreeMap<>(
            payload.getReviewGroupDecisionsRegulatorLed());
        final List<String> reviewGroupsVariationScheduleItems = sortedDecisions
            .values()
            .stream()
            .map(EmpAcceptedVariationDecisionDetails::getVariationScheduleItems)
            .flatMap(List::stream)
            .toList();

        return Map.of(
            "reason", payload.getReasonRegulatorLed().getDocumentReason(),
            "empConsolidationNumber", payload.getEmpConsolidationNumber(),
            "variationScheduleItems", reviewGroupsVariationScheduleItems
        );
    }
}
