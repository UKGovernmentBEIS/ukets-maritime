package uk.gov.mrtm.api.integration.external.verification.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerification;
import uk.gov.mrtm.api.reporting.validation.AerVerificationReportValidatorService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class ExternalAerVerificationValidatorTest {

    @InjectMocks
    private ExternalAerVerificationValidator validator;

    @Mock
    private AerVerificationReportValidatorService aerVerificationReportValidatorService;

    @Test
    void validateData() {
        StagingAerVerification staging = mock(StagingAerVerification.class);

        validator.validateData(staging);

        verify(aerVerificationReportValidatorService).validateStagingAerVerification(staging);
        verifyNoMoreInteractions(aerVerificationReportValidatorService);
    }

    @Test
    void validateData_throws_error() {
        StagingAerVerification staging = mock(StagingAerVerification.class);
        doThrow(new BusinessException(ErrorCode.INTERNAL_SERVER)).when(aerVerificationReportValidatorService).validateStagingAerVerification(staging);

        BusinessException be = assertThrows(BusinessException.class, () -> validator.validateData(staging));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INTERNAL_SERVER);

        verify(aerVerificationReportValidatorService).validateStagingAerVerification(staging);
        verifyNoMoreInteractions(aerVerificationReportValidatorService);
    }

}