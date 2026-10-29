package uk.gov.mrtm.api.web.config.swagger;

import org.springframework.stereotype.Component;

import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.verification.AerVerificationSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.empissuance.EmpIssuanceSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.empvariation.EmpVariationSubmitRequestFeedbackPayload;
import uk.gov.netz.api.swagger.SwaggerSchemasAbstractProvider;

@Component
public class MrtmRequestFeedbackPayloadSchemasProvider extends SwaggerSchemasAbstractProvider {

    @Override
    public void afterPropertiesSet() {
        addResolvedShemas(AerSubmitRequestFeedbackPayload.class.getSimpleName(), AerSubmitRequestFeedbackPayload.class);
        addResolvedShemas(AerVerificationSubmitRequestFeedbackPayload.class.getSimpleName(), AerVerificationSubmitRequestFeedbackPayload.class);
        addResolvedShemas(EmpIssuanceSubmitRequestFeedbackPayload.class.getSimpleName(), EmpIssuanceSubmitRequestFeedbackPayload.class);
        addResolvedShemas(EmpVariationSubmitRequestFeedbackPayload.class.getSimpleName(), EmpVariationSubmitRequestFeedbackPayload.class);
    }

}
