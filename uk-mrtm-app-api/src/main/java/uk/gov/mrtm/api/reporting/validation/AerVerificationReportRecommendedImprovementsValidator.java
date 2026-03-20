package uk.gov.mrtm.api.reporting.validation;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.common.AerVerificationReferencePrefix;
import uk.gov.mrtm.api.reporting.domain.common.VerifierComment;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AerVerificationReportRecommendedImprovementsValidator extends AerVerificationReportReferenceValidator {

    @Override
    public Set<String> getReferences(AerVerificationReport verificationReport) {
        return verificationReport.getVerificationData().getRecommendedImprovements().getRecommendedImprovements()
                .stream()
                .map(VerifierComment::getReference)
                .collect(Collectors.toSet());
    }

    @Override
    public String getPrefix() {
        return AerVerificationReferencePrefix.RECOMMENDED_IMPROVEMENTS.getPrefix();
    }

    @Override
    public AerViolation.ViolationMessage getAerViolationMessage() {
        return AerViolation.ViolationMessage.VERIFICATION_INVALID_RECOMMENDED_IMPROVEMENT_REFERENCE;
    }
}
