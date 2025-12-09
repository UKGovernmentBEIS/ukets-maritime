package uk.gov.mrtm.api.reporting.validation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.ArrayList;
import java.util.List;

@Service
@Validated
@RequiredArgsConstructor
public class AerValidatorService {

    private final List<AerContextValidator> aerContextValidators;
    private final AerVerificationReportValidatorService aerVerificationReportValidatorService;
    public void validate(@Valid @NotNull AerContainer aerContainer, Long accountId) {
        //validate aer
        validateAer(aerContainer, accountId);

        //validate verification report existence
        validateVerificationReportExistence(aerContainer);

        //validate verification report
        if (!ObjectUtils.isEmpty(aerContainer.getVerificationReport())) {
            aerVerificationReportValidatorService.validate(aerContainer.getAer(), aerContainer.getVerificationReport());
        }
    }

    public void validateAer(@Valid @NotNull AerContainer aerContainer, Long accountId) {
        List<AerValidationResult> aerValidationResults = new ArrayList<>();
        if (Boolean.TRUE.equals(aerContainer.getReportingRequired())) {
            aerContextValidators.forEach(v -> aerValidationResults.add(v.validate(aerContainer, accountId)));
        }
        boolean isValid = aerValidationResults.stream().allMatch(AerValidationResult::isValid);

        if(!isValid) {
            throw new BusinessException(MrtmErrorCode.INVALID_AER, AerValidatorHelper.extractAerViolations(aerValidationResults));
        }
    }

    public void validateStagingAer(@Valid @NotNull StagingAer staging) {
        // Trigger validations
    }

    private void validateVerificationReportExistence(AerContainer aerContainer) {
        if(Boolean.TRUE.equals(aerContainer.getReportingRequired()) &&
            ObjectUtils.isEmpty(aerContainer.getVerificationReport())
        ) {
                throw new BusinessException(MrtmErrorCode.AER_REQUEST_IS_NOT_AER,
                    AerValidationResult.builder().valid(false).aerViolations(List.of(
                        new AerViolation(AerVerificationReport.class.getSimpleName(),
                            AerViolation.ViolationMessage.NO_VERIFICATION_REPORT_FOUND))).build()
                );
        }
    }
}
