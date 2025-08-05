package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpValidatorServiceTest {

    @InjectMocks
    private EmpValidatorService empValidatorService;

    @Spy
    private ArrayList<EmpContextValidator> empContextValidators;

    @Mock
    private EmpEmissionsValidator empEmissionsValidator;

    @Mock
    private EmpOperatorDetailsValidator empOperatorDetailsValidator;

    @BeforeEach
    void setUp() {
        empContextValidators.add(empEmissionsValidator);
        empContextValidators.add(empOperatorDetailsValidator);
    }

    @Test
    void validateEmissionsMonitoringPlan_emission_fuels_valid() {
        Long accountId = 1L;
        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder().build();

        when(empEmissionsValidator.validate(empContainer, accountId)).thenReturn(EmissionsMonitoringPlanValidationResult.validEmissionsMonitoringPlan());
        when(empOperatorDetailsValidator.validate(empContainer, accountId)).thenReturn(EmissionsMonitoringPlanValidationResult.validEmissionsMonitoringPlan());

        empValidatorService.validateEmissionsMonitoringPlan(empContainer, accountId);

        verify(empEmissionsValidator).validate(empContainer, accountId);
    }

    @Test
    void validateEmissionsMonitoringPlan_emission_fuels_invalid() {
        Long accountId = 1L;
        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder().build();

        when(empEmissionsValidator.validate(empContainer, accountId))
            .thenReturn(EmissionsMonitoringPlanValidationResult.invalidEmissionsMonitoringPlan(List.of(
                new EmissionsMonitoringPlanViolation(EmissionsMonitoringPlanContainer.class.getSimpleName(),
                    EmissionsMonitoringPlanViolation.ViolationMessage.DUPLICATE_EMISSIONS_FUEL_NAME))));

        when(empOperatorDetailsValidator.validate(empContainer, accountId))
                .thenReturn(EmissionsMonitoringPlanValidationResult.invalidEmissionsMonitoringPlan(List.of(
                        new EmissionsMonitoringPlanViolation(EmissionsMonitoringPlanContainer.class.getSimpleName(),
                                EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_IMO_NUMBER))));

        BusinessException be = assertThrows(BusinessException.class,
            () -> empValidatorService.validateEmissionsMonitoringPlan(empContainer, accountId));

        verify(empEmissionsValidator).validate(empContainer, accountId);
        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_EMP);
    }
}