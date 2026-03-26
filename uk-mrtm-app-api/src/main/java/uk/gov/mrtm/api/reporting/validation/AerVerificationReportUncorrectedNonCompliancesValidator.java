package uk.gov.mrtm.api.reporting.validation;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.common.AerVerificationReferencePrefix;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AerVerificationReportUncorrectedNonCompliancesValidator extends AerVerificationReportReferenceValidator {

    @Override
    public Set<String> getReferences(AerVerificationReport verificationReport) {
        return verificationReport.getVerificationData().getUncorrectedNonCompliances().getUncorrectedNonCompliances()
            .stream()
            .map(UncorrectedItem::getReference)
            .collect(Collectors.toSet());
    }

    @Override
    public String getPrefix() {
        return AerVerificationReferencePrefix.UNCORRECTED_NON_COMPLIANCES.getPrefix();
    }

    @Override
    public AerViolation.ViolationMessage getAerViolationMessage() {
        return AerViolation.ViolationMessage.VERIFICATION_REPORT_INVALID_UNCORRECTED_NON_COMPLIANCES_REFERENCE;
    }
}
