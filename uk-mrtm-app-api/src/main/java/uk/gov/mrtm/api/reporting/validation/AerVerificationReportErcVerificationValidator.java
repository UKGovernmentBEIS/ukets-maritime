package uk.gov.mrtm.api.reporting.validation;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.verification.AerEmissionsReductionClaimVerification;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.ArrayList;
import java.util.List;

@Service
public class AerVerificationReportErcVerificationValidator implements AerVerificationReportContextValidator{

    @Override
    public AerValidationResult validate(Aer aer, AerVerificationReport verificationReport) {
        List<AerViolation> aerViolations = new ArrayList<>();

        Boolean smfExists = aer.getSmf().getExist();
        AerEmissionsReductionClaimVerification ercVerification =
            verificationReport.getVerificationData().getEmissionsReductionClaimVerification();

        if((Boolean.TRUE.equals(smfExists) && ercVerification == null) || (Boolean.FALSE.equals(smfExists) && ercVerification != null)) {
            aerViolations.add(new AerViolation(AerEmissionsReductionClaimVerification.class.getSimpleName(),
                AerViolation.ViolationMessage.VERIFICATION_REPORT_INVALID_ERC_VERIFICATION_AND_SMF_EXISTS_COMBINATION));
        }

        return AerValidationResult.builder()
            .valid(aerViolations.isEmpty())
            .aerViolations(aerViolations)
            .build();
    }
}
