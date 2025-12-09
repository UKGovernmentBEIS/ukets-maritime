package uk.gov.mrtm.api.integration.external.emp.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.ExternalBusinessException;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate.EmpMandate;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpEmissionsValidator;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpMandateValidator;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExternalEmpValidatorTest {

    @InjectMocks
    private ExternalEmpValidator  validator;

    @Mock
    private EmpMandateValidator empMandateValidator;
    @Mock
    private EmpEmissionsValidator empEmissionsValidator;
    @Mock
    private EmpValidatorService empValidatorService;

    @Test
    void validate() {
        String companyImoNumber = "1234567";
        StagingEmissionsMonitoringPlan staging = mock(StagingEmissionsMonitoringPlan.class);
        EmpEmissions emissions = mock(EmpEmissions.class);
        EmpMandate mandate = mock(EmpMandate.class);

        when(empMandateValidator.validate(mandate, emissions, companyImoNumber))
            .thenReturn(EmissionsMonitoringPlanValidationResult.validEmissionsMonitoringPlan());
        when(empEmissionsValidator.validate(emissions))
            .thenReturn(EmissionsMonitoringPlanValidationResult.validEmissionsMonitoringPlan());
        when(staging.getEmissions()).thenReturn(emissions);
        when(staging.getMandate()).thenReturn(mandate);

        validator.validate(staging, companyImoNumber);

        verify(empMandateValidator).validate(mandate, emissions, companyImoNumber);
        verify(empEmissionsValidator).validate(emissions);
        verify(empValidatorService).validateStagingEmissionsMonitoringPlan(staging);
        verifyNoMoreInteractions(empMandateValidator, empEmissionsValidator, empValidatorService);
    }

    @Test
    void validate_is_invalid() {
        String companyImoNumber = "1234567";
        StagingEmissionsMonitoringPlan staging = mock(StagingEmissionsMonitoringPlan.class);
        EmpEmissions emissions = mock(EmpEmissions.class);
        EmpMandate mandate = mock(EmpMandate.class);
        EmissionsMonitoringPlanValidationResult mandateError = EmissionsMonitoringPlanValidationResult.builder()
            .valid(false)
            .empViolations(List.of(new EmissionsMonitoringPlanViolation("a", EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_REGISTERED_OWNER_IMO_NUMBER, "b")))
            .build();
        EmissionsMonitoringPlanValidationResult emissionsError = EmissionsMonitoringPlanValidationResult.builder()
            .valid(false)
            .empViolations(List.of(new EmissionsMonitoringPlanViolation("c", EmissionsMonitoringPlanViolation.ViolationMessage.DUPLICATE_EMISSIONS_SOURCE_NAME, "d")))
            .build();

        when(empMandateValidator.validate(mandate, emissions, companyImoNumber)).thenReturn(mandateError);
        when(empEmissionsValidator.validate(emissions)).thenReturn(emissionsError);
        when(staging.getEmissions()).thenReturn(emissions);
        when(staging.getMandate()).thenReturn(mandate);

        ExternalBusinessException be =
            assertThrows(ExternalBusinessException.class, () -> validator.validate(staging, companyImoNumber));

        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_EMP);
        assertThat(be.getData()).hasSize(2);
        assertEquals(be.getData()[0].getFieldName(), "a");
        assertEquals(be.getData()[0].getMessage(), "Registered owner IMO number already exists | ErrorData: [b]");
        assertEquals(be.getData()[1].getFieldName(), "c");
        assertEquals(be.getData()[1].getMessage(), "EMP contains multiple emission sources with the same name about the same ship | ErrorData: [d]");
        verify(empMandateValidator).validate(mandate, emissions, companyImoNumber);
        verify(empEmissionsValidator).validate(emissions);
        verifyNoMoreInteractions(empMandateValidator, empEmissionsValidator, empValidatorService);
        verifyNoInteractions(empValidatorService);
    }

    @Test
    void validate_staging_is_invalid() {
        String companyImoNumber = "1234567";
        StagingEmissionsMonitoringPlan staging = mock(StagingEmissionsMonitoringPlan.class);
        EmpEmissions emissions = mock(EmpEmissions.class);
        EmpMandate mandate = mock(EmpMandate.class);

        when(empMandateValidator.validate(mandate, emissions, companyImoNumber))
            .thenReturn(EmissionsMonitoringPlanValidationResult.validEmissionsMonitoringPlan());
        when(empEmissionsValidator.validate(emissions))
            .thenReturn(EmissionsMonitoringPlanValidationResult.validEmissionsMonitoringPlan());
        when(staging.getEmissions()).thenReturn(emissions);
        when(staging.getMandate()).thenReturn(mandate);

        doThrow(new BusinessException(ErrorCode.INTERNAL_SERVER)).when(empValidatorService).validateStagingEmissionsMonitoringPlan(staging);

        BusinessException be = assertThrows(BusinessException.class, () -> validator.validate(staging, companyImoNumber));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INTERNAL_SERVER);

        verify(empMandateValidator).validate(mandate, emissions, companyImoNumber);
        verify(empEmissionsValidator).validate(emissions);
        verify(empValidatorService).validateStagingEmissionsMonitoringPlan(staging);
        verifyNoMoreInteractions(empValidatorService, empMandateValidator, empEmissionsValidator);
    }
}