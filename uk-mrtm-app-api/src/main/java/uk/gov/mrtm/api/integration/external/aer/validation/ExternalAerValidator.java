package uk.gov.mrtm.api.integration.external.aer.validation;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.common.exception.ExternalBusinessException;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.integration.external.aer.transform.AerViolationMapper;
import uk.gov.mrtm.api.reporting.validation.AerEmissionsValidator;
import uk.gov.mrtm.api.reporting.validation.AerShipAggregatedDataValidator;
import uk.gov.mrtm.api.reporting.validation.AerSmfValidator;
import uk.gov.mrtm.api.reporting.validation.AerValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.validation.Violation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Validated
@Log4j2
public class ExternalAerValidator {

    private final AerEmissionsValidator aerEmissionsValidator;
    private final AerShipAggregatedDataValidator aerShipAggregatedDataValidator;
    private final AerSmfValidator aerSmfValidator;
    private final AerValidatorService aerValidatorService;
    private static final AerViolationMapper AER_VIOLATION_MAPPER = Mappers.getMapper(AerViolationMapper.class);

    public void validate(StagingAer staging) {
        List<AerValidationResult> validationResults = new ArrayList<>();
        validationResults.add(aerSmfValidator.validate(staging.getSmf(), staging.getEmissions()));
        validationResults.add(aerEmissionsValidator.validate(staging.getEmissions()));
        validationResults.add(aerShipAggregatedDataValidator.validate(staging.getAggregatedData(), staging.getEmissions(),
            Collections.emptySet(), Collections.emptySet()));

        boolean isValid = validationResults.stream().allMatch(AerValidationResult::isValid);

        if (!isValid) {
            throw new ExternalBusinessException(MrtmErrorCode.INVALID_AER, extractEmissionsMonitoringPlanViolations(validationResults));
        }

        validateStagingEmissionsMonitoringPlan(staging);
    }

    // This is used to verify that the staging model is valid. INTERNAL_SERVER is thrown because this indicates
    // an error on mapping and not a bad request.
    private void validateStagingEmissionsMonitoringPlan(StagingAer staging) {
        try {
            aerValidatorService.validateStagingAer(staging);
        } catch (Exception e) {
            log.error("Error when validating staging AER: {}", e.getMessage());
            throw new BusinessException(ErrorCode.INTERNAL_SERVER);
        }
    }

    private Violation[] extractEmissionsMonitoringPlanViolations(List<AerValidationResult> empValidationResults) {
        return empValidationResults.stream()
            .filter(empValidationResult -> !empValidationResult.isValid())
            .flatMap(empValidationResult -> empValidationResult.getAerViolations().stream())
            .map(AER_VIOLATION_MAPPER::toViolation)
            .toArray(Violation[]::new);
    }
}
