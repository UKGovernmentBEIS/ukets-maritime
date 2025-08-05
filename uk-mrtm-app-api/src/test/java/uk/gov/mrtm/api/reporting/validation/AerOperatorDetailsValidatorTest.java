package uk.gov.mrtm.api.reporting.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerOperatorDetails;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.INVALID_IMO_NUMBER;

@ExtendWith(MockitoExtension.class)
class AerOperatorDetailsValidatorTest {

    private static final long ACCOUNT_ID = 1L;
    private static final String IMO_NUMBER = "1234567";

    @InjectMocks
    private AerOperatorDetailsValidator validator;

    @Mock
    private MrtmAccountQueryService accountQueryService;

    @Test
    void validate_is_valid() {
        AerContainer aerContainer = AerContainer
            .builder()
            .aer(Aer.builder().operatorDetails(AerOperatorDetails.builder().imoNumber(IMO_NUMBER).build()).build())
            .build();

        when(accountQueryService.existsByImoNumberAndId(IMO_NUMBER, ACCOUNT_ID)).thenReturn(true);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertTrue(result.isValid());
        assertThat(result.getAerViolations()).isEmpty();

        verify(accountQueryService).existsByImoNumberAndId(IMO_NUMBER, ACCOUNT_ID);
        verifyNoMoreInteractions(accountQueryService);
    }

    @Test
    void validate_is_invalid() {
        AerContainer aerContainer = AerContainer
            .builder()
            .aer(Aer.builder().operatorDetails(AerOperatorDetails.builder().imoNumber(IMO_NUMBER).build()).build())
            .build();

        when(accountQueryService.existsByImoNumberAndId(IMO_NUMBER, ACCOUNT_ID)).thenReturn(false);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(aerViolation ->
            aerViolation.getMessage().equals(INVALID_IMO_NUMBER.getMessage()));


        verify(accountQueryService).existsByImoNumberAndId(IMO_NUMBER, ACCOUNT_ID);
        verifyNoMoreInteractions(accountQueryService);
    }
}