package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.ArrayList;
import java.util.List;

@Service
@Validated
@RequiredArgsConstructor
public class EmpValidatorService {

    private final List<EmpContextValidator> empContextValidators;

    public void validateEmissionsMonitoringPlan(@Valid EmissionsMonitoringPlanContainer empContainer, Long accountId) {
        List<EmissionsMonitoringPlanValidationResult> empValidationResults = new ArrayList<>();
        empContextValidators.forEach(v -> empValidationResults.add(v.validate(empContainer, accountId)));

        boolean isValid = empValidationResults.stream().allMatch(EmissionsMonitoringPlanValidationResult::isValid);

        if (!isValid) {
            throw new BusinessException(MrtmErrorCode.INVALID_EMP, extractEmissionsMonitoringPlanViolations(empValidationResults));
        }
    }

    private Object[] extractEmissionsMonitoringPlanViolations(List<EmissionsMonitoringPlanValidationResult> empValidationResults) {
        return empValidationResults.stream()
                .filter(empValidationResult -> !empValidationResult.isValid())
                .flatMap(empValidationResult -> empValidationResult.getEmpViolations().stream())
                .toArray();
    }
}
