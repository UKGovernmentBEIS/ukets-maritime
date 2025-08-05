package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.INVALID_IMO_NUMBER;

@ExtendWith(MockitoExtension.class)
class EmpOperatorDetailsValidatorTest {

    private static final long ACCOUNT_ID = 1L;
    private static final String IMO_NUMBER = "1234567";

    @InjectMocks
    private EmpOperatorDetailsValidator validator;

    @Mock
    private MrtmAccountQueryService accountQueryService;

    @Test
    void validate_is_valid() {
        EmissionsMonitoringPlanContainer aerContainer = EmissionsMonitoringPlanContainer
            .builder()
            .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().operatorDetails(EmpOperatorDetails.builder().imoNumber(IMO_NUMBER).build()).build())
            .build();

        when(accountQueryService.existsByImoNumberAndId(IMO_NUMBER, ACCOUNT_ID)).thenReturn(true);

        EmissionsMonitoringPlanValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertTrue(result.isValid());
        assertThat(result.getEmpViolations()).isEmpty();

        verify(accountQueryService).existsByImoNumberAndId(IMO_NUMBER, ACCOUNT_ID);
        verifyNoMoreInteractions(accountQueryService);
    }

    @Test
    void validate_is_invalid() {
        EmissionsMonitoringPlanContainer aerContainer = EmissionsMonitoringPlanContainer
            .builder()
            .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().operatorDetails(EmpOperatorDetails.builder().imoNumber(IMO_NUMBER).build()).build())
            .build();

        when(accountQueryService.existsByImoNumberAndId(IMO_NUMBER, ACCOUNT_ID)).thenReturn(false);

        EmissionsMonitoringPlanValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(INVALID_IMO_NUMBER.getMessage()));


        verify(accountQueryService).existsByImoNumberAndId(IMO_NUMBER, ACCOUNT_ID);
        verifyNoMoreInteractions(accountQueryService);
    }
}