package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.Year;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerCreationServiceTest {
    private static final long ACCOUNT_ID = 1L;
    private static final Year REPORTING_YEAR = Year.of(2025);

    @InjectMocks
    private AerCreationService aerCreationService;

    @Mock
    private AerCreationRequestParamsBuilderService aerCreationRequestParamsBuilderService;

    @Mock
    private AerCreationValidatorService aerCreationValidatorService;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void createRequestAer() {
        RequestParams requestParams = mock(RequestParams.class);
        AppUser user = AppUser.builder()
                .userId("userId").firstName("firstName").lastName("lastName").build();
        when(aerCreationRequestParamsBuilderService.buildRequestParams(ACCOUNT_ID, REPORTING_YEAR))
            .thenReturn(requestParams);
        when(aerCreationValidatorService.validateAccountStatus(ACCOUNT_ID))
            .thenReturn(RequestCreateValidationResult.builder().valid(true).build());
        when(aerCreationValidatorService.validateReportingYear(ACCOUNT_ID, REPORTING_YEAR))
            .thenReturn(RequestCreateValidationResult.builder().valid(true).build());

        aerCreationService.createRequestAer(ACCOUNT_ID, REPORTING_YEAR);

        verify(aerCreationRequestParamsBuilderService).buildRequestParams(ACCOUNT_ID, REPORTING_YEAR);
        verify(aerCreationValidatorService).validateAccountStatus(ACCOUNT_ID);
        verify(aerCreationValidatorService).validateReportingYear(ACCOUNT_ID, REPORTING_YEAR);
        verify(startProcessRequestService).startProcess(requestParams);
        verifyNoMoreInteractions(aerCreationRequestParamsBuilderService,
            aerCreationValidatorService, startProcessRequestService);
    }

    @Test
    void createRequestAer_invalid_status() {
        AppUser user = AppUser.builder()
                .userId("userId").firstName("firstName").lastName("lastName").build();
        when(aerCreationValidatorService.validateAccountStatus(ACCOUNT_ID))
            .thenReturn(RequestCreateValidationResult.builder().valid(false).build());

        final BusinessException exception = assertThrows(BusinessException.class, () ->
            aerCreationService.createRequestAer(ACCOUNT_ID, REPORTING_YEAR));

        assertEquals(MrtmErrorCode.AER_CREATION_NOT_ALLOWED_INVALID_ACCOUNT_STATUS, exception.getErrorCode());

        verify(aerCreationValidatorService).validateAccountStatus(ACCOUNT_ID);
        verifyNoMoreInteractions(aerCreationRequestParamsBuilderService,
            aerCreationValidatorService, startProcessRequestService);
        verifyNoInteractions(startProcessRequestService, aerCreationRequestParamsBuilderService);
    }

    @Test
    void createRequestAer_invalid_year() {
        AppUser user = AppUser.builder()
                .userId("userId").firstName("firstName").lastName("lastName").build();
        when(aerCreationValidatorService.validateAccountStatus(ACCOUNT_ID))
            .thenReturn(RequestCreateValidationResult.builder().valid(true).build());
        when(aerCreationValidatorService.validateReportingYear(ACCOUNT_ID, REPORTING_YEAR))
            .thenReturn(RequestCreateValidationResult.builder().valid(false).build());

        final BusinessException exception = assertThrows(BusinessException.class, () ->
            aerCreationService.createRequestAer(ACCOUNT_ID, REPORTING_YEAR));

        assertEquals(MrtmErrorCode.AER_ALREADY_EXISTS_FOR_REPORTING_YEAR, exception.getErrorCode());

        verify(aerCreationValidatorService).validateAccountStatus(ACCOUNT_ID);
        verify(aerCreationValidatorService).validateReportingYear(ACCOUNT_ID, REPORTING_YEAR);
        verifyNoMoreInteractions(aerCreationRequestParamsBuilderService,
            aerCreationValidatorService, startProcessRequestService);
        verifyNoInteractions(startProcessRequestService, aerCreationRequestParamsBuilderService);
    }
}
