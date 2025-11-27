package uk.gov.mrtm.api.integration.external.emp.validation;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.common.exception.ExternalBusinessException;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpEmissionsValidator;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpMandateValidator;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.transform.EmpViolationMapper;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.validation.Violation;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Validated
public class ExternalEmpValidator {

    private final EmpMandateValidator empMandateValidator;
    private final EmpEmissionsValidator empEmissionsValidator;
    private final EmpValidatorService empValidatorService;
    private static final EmpViolationMapper EMP_VIOLATION_MAPPER = Mappers.getMapper(EmpViolationMapper.class);

    public void validate(StagingEmissionsMonitoringPlan staging, String companyImoNumber) {
        validateStagingEmissionsMonitoringPlan(staging);

        List<EmissionsMonitoringPlanValidationResult> validationResults = new ArrayList<>();
        validationResults.add(empMandateValidator.validate(staging.getMandate(), staging.getEmissions(), companyImoNumber));
        validationResults.add(empEmissionsValidator.validate(staging.getEmissions()));

        boolean isValid = validationResults.stream().allMatch(EmissionsMonitoringPlanValidationResult::isValid);

        if (!isValid) {
            throw new ExternalBusinessException(MrtmErrorCode.INVALID_EMP, extractEmissionsMonitoringPlanViolations(validationResults));
        }
    }

    // This is used to verify that the staging model is valid. INTERNAL_SERVER is thrown because this indicates
    // an error on mapping and not a bad request.
    private void validateStagingEmissionsMonitoringPlan(StagingEmissionsMonitoringPlan staging) {
        try {
            empValidatorService.validateStagingEmissionsMonitoringPlan(staging);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER);
        }
    }

    private Violation[] extractEmissionsMonitoringPlanViolations(List<EmissionsMonitoringPlanValidationResult> empValidationResults) {
        return empValidationResults.stream()
            .filter(empValidationResult -> !empValidationResult.isValid())
            .flatMap(empValidationResult -> empValidationResult.getEmpViolations().stream())
            .map(EMP_VIOLATION_MAPPER::toViolation)
            .toArray(Violation[]::new);
    }
}
