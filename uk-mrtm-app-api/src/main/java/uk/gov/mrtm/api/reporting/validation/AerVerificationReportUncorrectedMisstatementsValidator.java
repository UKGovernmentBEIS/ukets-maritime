package uk.gov.mrtm.api.reporting.validation;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.common.AerVerificationReferencePrefix;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AerVerificationReportUncorrectedMisstatementsValidator extends AerVerificationReportReferenceValidator {

    @Override
    public Set<String> getReferences(AerVerificationReport verificationReport) {
        return verificationReport.getVerificationData().getUncorrectedMisstatements().getUncorrectedMisstatements()
            .stream()
            .map(UncorrectedItem::getReference)
            .collect(Collectors.toSet());
    }

    @Override
    public String getPrefix() {
        return AerVerificationReferencePrefix.UNCORRECTED_MISSTATEMENTS.getPrefix();
    }

    @Override
    public AerViolation.ViolationMessage getAerViolationMessage() {
        return AerViolation.ViolationMessage.VERIFICATION_REPORT_INVALID_UNCORRECTED_MISSTATEMENT_REFERENCE;
    }
}
