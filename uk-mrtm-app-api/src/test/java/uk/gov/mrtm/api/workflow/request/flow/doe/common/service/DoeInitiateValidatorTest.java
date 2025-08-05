package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.netz.api.account.domain.enumeration.AccountStatus;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateAccountStatusValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoeInitiateValidatorTest {

    @InjectMocks
    private DoeInitiateValidator validator;

    @Mock
    private RequestCustomRepository requestCustomRepository;

    @Mock
    RequestCreateValidatorService requestCreateValidatorService;

    @Mock
    RequestQueryService requestQueryService;


    @Test
    void getApplicableAccountStatuses() {
        assertThat(validator.getApplicableAccountStatuses()).isEqualTo(Set.of(
                MrtmAccountStatus.NEW,
                MrtmAccountStatus.LIVE,
                MrtmAccountStatus.WITHDRAWN));
    }

    @Test
    void getReferableRequestType() {
        assertThat(validator.getReferableRequestType()).isEqualTo(MrtmRequestType.AER);
    }

    @Test
    void getType() {
        assertThat(validator.getRequestType()).isEqualTo(MrtmRequestType.DOE);
    }

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
        verifyNoMoreInteractions(requestQueryService);
        verifyNoInteractions(requestCreateValidatorService);
    }

    @Test
    void validateAction_valid() {
        final Long accountId = 1L;
        final String requestId = "AEM-1";
        final Year year = Year.of(2023);
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(requestId)
                .build();
        final Set<AccountStatus> applicableAccountStatuses = Set.of(MrtmAccountStatus.NEW,
                MrtmAccountStatus.LIVE, MrtmAccountStatus.WITHDRAWN);
        final AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder()
                .type(MrtmRequestMetadataType.AER)
                .year(year)
                .isExempted(false)
                .build();
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, MrtmRequestType.AER, RequestStatuses.IN_PROGRESS,
                LocalDateTime.now(), aerRequestMetadata);

        when(requestQueryService.findRequestDetailsById(requestId))
                .thenReturn(requestDetailsDTO);

        RequestCreateAccountStatusValidationResult accountStatusValidationResult = new RequestCreateAccountStatusValidationResult(true);
        when(requestCreateValidatorService.validateAccountStatuses(accountId, applicableAccountStatuses))
                .thenReturn(accountStatusValidationResult);

        when(requestCustomRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
                accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), year.getValue()))
                .thenReturn(Optional.empty());

        // Invoke
        final RequestCreateValidationResult result = validator.validateAction(accountId, payload);

        // Verify
        assertThat(result.isValid()).isTrue();
        assertThat(result.getReportedRequestTypes()).isEmpty();
        assertThat(result.getReportedAccountStatus()).isNull();

        verify(requestQueryService, times(1)).findRequestDetailsById(requestId);
        verify(requestCustomRepository, times(1)).findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
                accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), year.getValue());
        verify(requestCreateValidatorService, times(1))
                .validateAccountStatuses(accountId, applicableAccountStatuses);
    }

    //
    @Test
    void validateAction_not_valid_account_status() {
        final Long accountId = 1L;
        final String requestId = "AEM-1";
        final Year year = Year.of(2023);
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(requestId)
                .build();
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, MrtmRequestType.AER, RequestStatuses.COMPLETED,
                LocalDateTime.now(), AerRequestMetadata.builder().year(year).build());

        final Set<AccountStatus> applicableAccountStatuses = Set.of(MrtmAccountStatus.NEW,
                MrtmAccountStatus.LIVE, MrtmAccountStatus.WITHDRAWN);


        RequestCreateAccountStatusValidationResult accountStatusValidationResult =
                new RequestCreateAccountStatusValidationResult(false, MrtmAccountStatus.CLOSED);

        when(requestCreateValidatorService.validateAccountStatuses(accountId, applicableAccountStatuses))
                .thenReturn(accountStatusValidationResult);

        when(requestQueryService.findRequestDetailsById(requestId))
                .thenReturn(requestDetailsDTO);

        when(requestCustomRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
                accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), year.getValue()))
                .thenReturn(Optional.empty());

        // Invoke
        final RequestCreateValidationResult result = validator.validateAction(accountId, payload);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getReportedRequestTypes()).isEmpty();
        assertThat(result.getReportedAccountStatus()).isEqualTo(MrtmAccountStatus.CLOSED.getName());
        assertThat(result.getApplicableAccountStatuses()).isEqualTo(applicableAccountStatuses.stream()
                .map(AccountStatus::getName).collect(Collectors.toSet()));

        verify(requestQueryService, times(1)).findRequestDetailsById(requestId);
        verify(requestCreateValidatorService, times(1))
                .validateAccountStatuses(accountId, applicableAccountStatuses);
    }

    @Test
    void validateAction_throws_exception_metadata_not_found() {
        final Long accountId = 1L;
        final String requestId = "AEM-1";
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(requestId)
                .build();
        final Set<AccountStatus> applicableAccountStatuses = Set.of(MrtmAccountStatus.NEW,
                MrtmAccountStatus.LIVE, MrtmAccountStatus.WITHDRAWN);
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, MrtmRequestType.AER, RequestStatuses.COMPLETED,
                LocalDateTime.now(), null);

        when(requestQueryService.findRequestDetailsById(requestId))
                .thenReturn(requestDetailsDTO);

        RequestCreateAccountStatusValidationResult accountStatusValidationResult = new RequestCreateAccountStatusValidationResult(true);
        when(requestCreateValidatorService.validateAccountStatuses(accountId, applicableAccountStatuses))
                .thenReturn(accountStatusValidationResult);

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class,
                () -> validator.validateAction(accountId, payload));

        // Verify
        assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
        verify(requestQueryService, times(1)).findRequestDetailsById(requestId);
        verifyNoMoreInteractions(requestQueryService);
        verify(requestCreateValidatorService, times(1)).validateAccountStatuses(accountId, applicableAccountStatuses);
    }

    @Test
    void validateAction_not_valid_request_type() {
        final Long accountId = 1L;
        final String requestId = "AEM-1";
        final Year year = Year.of(2023);
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(requestId)
                .build();
        final AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder().type(MrtmRequestMetadataType.AER).year(year).build();
        final Set<AccountStatus> applicableAccountStatuses = Set.of(MrtmAccountStatus.NEW,
                MrtmAccountStatus.LIVE, MrtmAccountStatus.WITHDRAWN);
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, MrtmRequestType.AER, RequestStatuses.COMPLETED,
                LocalDateTime.now(), aerRequestMetadata);
        final Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.DOE).build())
                .build();

        when(requestQueryService.findRequestDetailsById(requestId))
                .thenReturn(requestDetailsDTO);

        RequestCreateAccountStatusValidationResult accountStatusValidationResult = new RequestCreateAccountStatusValidationResult(true);

        when(requestCreateValidatorService.validateAccountStatuses(accountId, applicableAccountStatuses))
                .thenReturn(accountStatusValidationResult);

        when(requestCustomRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
                        accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), year.getValue()))
                .thenReturn(Optional.of(request));

        // Invoke
        final RequestCreateValidationResult result = validator.validateAction(accountId, payload);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getReportedRequestTypes()).containsExactly(MrtmRequestType.DOE);
        assertThat(result.getReportedAccountStatus()).isNull();

        verify(requestQueryService, times(1)).findRequestDetailsById(requestId);
        verify(requestCustomRepository, times(1)).findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
                accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), year.getValue());
        verify(requestCreateValidatorService, times(1))
                .validateAccountStatuses(accountId, applicableAccountStatuses);
    }

    @Test
    void validateAction_not_valid_exempted() {
        final Long accountId = 1L;
        final String requestId = "AEM-1";
        final Year year = Year.of(2023);
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId(requestId)
                .build();
        final AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder().type(MrtmRequestMetadataType.AER).year(year).isExempted(true).build();
        final Set<AccountStatus> applicableAccountStatuses = Set.of(MrtmAccountStatus.NEW,
                MrtmAccountStatus.LIVE, MrtmAccountStatus.WITHDRAWN);
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, MrtmRequestType.AER, RequestStatuses.COMPLETED,
                LocalDateTime.now(), aerRequestMetadata);

        when(requestQueryService.findRequestDetailsById(requestId))
                .thenReturn(requestDetailsDTO);

        RequestCreateAccountStatusValidationResult accountStatusValidationResult = new RequestCreateAccountStatusValidationResult(true);

        when(requestCreateValidatorService.validateAccountStatuses(accountId, applicableAccountStatuses))
                .thenReturn(accountStatusValidationResult);

        when(requestCustomRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
                accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), year.getValue()))
                .thenReturn(Optional.empty());

        // Invoke
        final RequestCreateValidationResult result = validator.validateAction(accountId, payload);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getReportedRequestTypes()).containsExactly(MrtmRequestType.DOE);
        assertThat(result.getReportedAccountStatus()).isNull();

        verify(requestQueryService, times(1)).findRequestDetailsById(requestId);
        verify(requestCustomRepository, times(1)).findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
                accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), year.getValue());
        verify(requestCreateValidatorService, times(1))
                .validateAccountStatuses(accountId, applicableAccountStatuses);
    }
}
