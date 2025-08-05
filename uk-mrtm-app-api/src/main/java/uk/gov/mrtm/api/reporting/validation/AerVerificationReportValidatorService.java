package uk.gov.mrtm.api.reporting.validation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.ArrayList;
import java.util.List;

@Service
@Validated
@RequiredArgsConstructor
public class AerVerificationReportValidatorService {

    private final List<AerVerificationReportContextValidator> aerVerificationReportContextValidators;

    public void validate(@Valid @NotNull AerVerificationReport verificationReport) {
        List<AerValidationResult> verificationReportValidationResults = new ArrayList<>();
        aerVerificationReportContextValidators
                .forEach(v -> verificationReportValidationResults.add(v.validate(verificationReport)));

        boolean isValid = verificationReportValidationResults.stream().allMatch(AerValidationResult::isValid);

        if (!isValid) {
            throw new BusinessException(MrtmErrorCode.INVALID_AER_VERIFICATION_REPORT,
                    AerValidatorHelper.extractAerViolations(verificationReportValidationResults));
        }
    }
}
