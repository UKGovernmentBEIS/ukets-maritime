package uk.gov.mrtm.api.workflow.request.feedback.domain.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.verification.AerVerificationSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.empissuance.EmpIssuanceSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.empvariation.EmpVariationSubmitRequestFeedbackPayload;
import uk.gov.netz.api.request.feedback.domain.RequestFeedbackPayload;
import uk.gov.netz.api.request.feedback.domain.RequestFeedbackType;

@Getter
@RequiredArgsConstructor
public enum MrtmRequestFeedbackType implements RequestFeedbackType {

    AER_SUBMIT(AerSubmitRequestFeedbackPayload.class),
    AER_VERIFICATION_SUBMIT(AerVerificationSubmitRequestFeedbackPayload.class),
    EMP_ISSUANCE_SUBMIT(EmpIssuanceSubmitRequestFeedbackPayload.class),
    EMP_VARIATION_SUBMIT(EmpVariationSubmitRequestFeedbackPayload.class);

    private final Class<? extends RequestFeedbackPayload> payloadClass;

    @Override
    public String getName() {
        return this.name();
    }
}