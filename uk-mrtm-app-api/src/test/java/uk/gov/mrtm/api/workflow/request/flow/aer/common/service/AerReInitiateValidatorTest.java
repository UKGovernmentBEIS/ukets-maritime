package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.netz.api.account.domain.enumeration.AccountStatus;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateAccountStatusValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerReInitiateValidatorTest {

    @InjectMocks
    private AerReInitiateValidator validator;

    @Mock
    private RequestCreateValidatorService requestCreateValidatorService;

    @Mock
    private RequestQueryService requestQueryService;

    @Test
    void validateAction_request_not_aer() {
        final Long accountId = 1L;
        final String requestId = "AEM-1";
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(requestId)
                .build();

        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, MrtmRequestType.EMP_ISSUANCE, RequestStatuses.COMPLETED,
                LocalDateTime.now(), null);

        when(requestQueryService.findRequestDetailsById(requestId))
                .thenReturn(requestDetailsDTO);


        // Invoke
        BusinessException ex = assertThrows(BusinessException.class,
                () -> validator.validateAction(accountId, payload));

        assertThat(ex.getErrorCode()).isEqualTo(MrtmErrorCode.AER_REQUEST_IS_NOT_AER);
        verify(requestQueryService, times(1)).findRequestDetailsById(requestId);
        verifyNoInteractions(requestCreateValidatorService);
    }

    @Test
    void validateAction_valid() {
        final Long accountId = 1L;
        final String requestId = "AEM-1";
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(requestId)
                .build();
        final Set<AccountStatus> applicableAccountStatuses = Set.of(MrtmAccountStatus.NEW,MrtmAccountStatus.LIVE, MrtmAccountStatus.WITHDRAWN);
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, MrtmRequestType.AER, RequestStatuses.COMPLETED,
                LocalDateTime.now(), AerRequestMetadata.builder().build());

        RequestCreateAccountStatusValidationResult accountStatusValidationResult = new RequestCreateAccountStatusValidationResult(true);

        when(requestCreateValidatorService.validateAccountStatuses(accountId, applicableAccountStatuses))
                .thenReturn(accountStatusValidationResult);

        when(requestQueryService.findRequestDetailsById(requestId))
                .thenReturn(requestDetailsDTO);

        // Invoke
        final RequestCreateValidationResult result = validator.validateAction(accountId, payload);

        // Verify
        assertThat(result.isValid()).isTrue();
        assertThat(result.getReportedRequestTypes()).isEmpty();
        assertThat(result.getReportedAccountStatus()).isNull();

        verify(requestQueryService, times(1)).findRequestDetailsById(requestId);
        verify(requestCreateValidatorService, times(1))
                .validateAccountStatuses(accountId, applicableAccountStatuses);
    }

    @Test
    void validateAction_not_valid_account_status() {
        final Long accountId = 1L;
        final String requestId = "AEM-1";
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(requestId)
                .build();
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, MrtmRequestType.AER, RequestStatuses.COMPLETED,
                LocalDateTime.now(), AerRequestMetadata.builder().build());

        RequestCreateAccountStatusValidationResult accountStatusValidationResult =
                new RequestCreateAccountStatusValidationResult(false, MrtmAccountStatus.CLOSED);

        when(requestCreateValidatorService.validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.NEW,MrtmAccountStatus.LIVE,MrtmAccountStatus.WITHDRAWN)))
                .thenReturn(accountStatusValidationResult);

        when(requestQueryService.findRequestDetailsById(requestId))
                .thenReturn(requestDetailsDTO);

        // Invoke
        final RequestCreateValidationResult result = validator.validateAction(accountId, payload);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getReportedRequestTypes()).isEmpty();
        assertThat(result.getReportedAccountStatus()).isEqualTo(MrtmAccountStatus.CLOSED.getName());
        assertThat(result.getApplicableAccountStatuses()).containsExactlyInAnyOrder(MrtmAccountStatus.NEW.getName(),MrtmAccountStatus.LIVE.getName(),MrtmAccountStatus.WITHDRAWN.getName());

        verify(requestQueryService, times(1)).findRequestDetailsById(requestId);
        verify(requestCreateValidatorService, times(1))
                .validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.NEW,MrtmAccountStatus.LIVE,MrtmAccountStatus.WITHDRAWN));
    }

    @Test
    void validateAction_invalid_request_type() {
        final Long accountId = 1L;
        final String requestId = "AEM-1";
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(requestId)
                .build();
        final Set<AccountStatus> applicableAccountStatuses = Set.of(MrtmAccountStatus.NEW,MrtmAccountStatus.LIVE, MrtmAccountStatus.WITHDRAWN);
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, MrtmRequestType.AER, RequestStatuses.IN_PROGRESS,
                LocalDateTime.now(), AerRequestMetadata.builder().build());

        RequestCreateAccountStatusValidationResult accountStatusValidationResult = new RequestCreateAccountStatusValidationResult(true);

        when(requestCreateValidatorService.validateAccountStatuses(accountId, applicableAccountStatuses))
                .thenReturn(accountStatusValidationResult);

        when(requestQueryService.findRequestDetailsById(requestId))
                .thenReturn(requestDetailsDTO);

        // Invoke
        final RequestCreateValidationResult result = validator.validateAction(accountId, payload);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getReportedRequestTypes()).containsExactly(MrtmRequestType.AER);
        assertThat(result.getReportedAccountStatus()).isNull();

        verify(requestQueryService, times(1)).findRequestDetailsById(requestId);
        verify(requestCreateValidatorService, times(1))
                .validateAccountStatuses(accountId, applicableAccountStatuses);
    }

    @Test
    void getApplicableAccountStatuses() {
        assertThat(validator.getApplicableAccountStatuses()).isEqualTo(Set.of(MrtmAccountStatus.NEW,MrtmAccountStatus.LIVE, MrtmAccountStatus.WITHDRAWN));
    }

    @Test
    void getReferableRequestType() {
        assertThat(validator.getReferableRequestType()).isEqualTo(MrtmRequestType.AER);
    }

    @Test
    void getType() {
        assertThat(validator.getRequestType()).isEqualTo(MrtmRequestType.AER);
    }
}
