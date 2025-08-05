package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateWorkflowParamsProvider;

import java.util.Map;

@Component
public class EmpVariationRejectedDocumentTemplateWorkflowParamsProvider implements DocumentTemplateWorkflowParamsProvider<EmpVariationRequestPayload> {

    @Override
    public String getContextActionType() {
        return MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_REJECTED;
    }

    @Override
    public Map<String, Object> constructParams(EmpVariationRequestPayload payload) {
        final String rejectionReason = payload.getDetermination().getReason();
        final String summary = payload.getDetermination().getSummary();

        return Map.of(
                "rejectionReason", rejectionReason,
                "summary", summary
        );
    }
}
