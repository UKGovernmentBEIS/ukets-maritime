package uk.gov.mrtm.api.integration.external.verification.validation;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerification;
import uk.gov.mrtm.api.reporting.validation.AerVerificationReportValidatorService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

@Component
@RequiredArgsConstructor
@Validated
@Log4j2
public class ExternalAerVerificationValidator {

    private final AerVerificationReportValidatorService aerVerificationReportValidatorService;

    public void validateData(StagingAerVerification staging) {
        validateStagingAerVerification(staging);
    }

    // This is used to verify that the staging model is valid. INTERNAL_SERVER is thrown because this indicates
    // an error on mapping and not a bad request.
    private void validateStagingAerVerification(StagingAerVerification staging) {
        try {
            aerVerificationReportValidatorService.validateStagingAerVerification(staging);
        } catch (Exception e) {
            log.error("Error when validating staging AER verification", e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER);
        }
    }
}
