package uk.gov.mrtm.api.account.service.repostingstatus;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import uk.gov.mrtm.api.account.domain.AccountReportingExemptEvent;
import uk.gov.mrtm.api.account.domain.AccountReportingRequiredEvent;
import uk.gov.mrtm.api.account.domain.AccountReportingStatus;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryCreationDTO;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;
import uk.gov.mrtm.api.account.repository.AccountReportingStatusRepository;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusHistoryCreationService;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.utils.DateService;

import java.time.LocalDateTime;
import java.time.Year;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountReportingStatusHistoryCreationServiceTest {

    @InjectMocks
    private AccountReportingStatusHistoryCreationService service;

    @Mock
    private MrtmAccountQueryService accountQueryService;

    @Mock
    private AccountReportingStatusRepository reportingStatusRepository;

    @Mock
    private ApplicationEventPublisher publisher;

    @Mock
    private DateService dateService;

    @Test
    void submitReportingStatus_to_requiredToReport() {
        Long accountId = 1L;
        Year year = Year.now();
        LocalDateTime now = LocalDateTime.now();
        final AccountReportingStatusHistoryCreationDTO reportingStatusHistoryCreationDTO = AccountReportingStatusHistoryCreationDTO
                .builder().status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT).reason("reason").build();
        final AppUser appUser = AppUser.builder().roleType(RoleTypeConstants.REGULATOR).userId("userId").firstName("first name").lastName("last name").build();
        AccountReportingStatus accountReportingStatus = AccountReportingStatus.builder().build();

        when(reportingStatusRepository.findByAccountIdAndYear(accountId, year))
                .thenReturn(accountReportingStatus);
        when(dateService.getLocalDateTime()).thenReturn(now);

        service.submitReportingStatus(accountId, reportingStatusHistoryCreationDTO, year, appUser);

        assertThat(accountReportingStatus.getReportingStatusHistoryList()).hasSize(1);
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getReason()).isEqualTo("reason");
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getReason()).isEqualTo("reason");
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getStatus()).isEqualTo(MrtmAccountReportingStatus.REQUIRED_TO_REPORT);
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getSubmitterId()).isEqualTo(appUser.getUserId());
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getSubmitterName()).isEqualTo(appUser.getFullName());
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getSubmissionDate()).isEqualTo(now);

        verify(publisher).publishEvent(AccountReportingRequiredEvent.builder()
            .accountId(accountId)
            .submitterId(appUser.getUserId())
            .year(year)
            .build()
        );
        verify(reportingStatusRepository).findByAccountIdAndYear(accountId, year);
        verify(reportingStatusRepository).save(accountReportingStatus);
        verifyNoMoreInteractions(accountQueryService, reportingStatusRepository, publisher);
    }

    @Test
    void submitReportingStatus_from_requiredToReport() {
        Long accountId = 1L;
        Year year = Year.now();
        LocalDateTime now = LocalDateTime.now();
        final AccountReportingStatusHistoryCreationDTO reportingStatusHistoryCreationDTO = AccountReportingStatusHistoryCreationDTO
            .builder().status(MrtmAccountReportingStatus.EXEMPT).reason("reason").build();
        final AppUser appUser = AppUser.builder().roleType(RoleTypeConstants.REGULATOR).userId("userId").firstName("first name").lastName("last name").build();
        AccountReportingStatus accountReportingStatus = AccountReportingStatus.builder().status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT).build();

        when(reportingStatusRepository.findByAccountIdAndYear(accountId, year))
            .thenReturn(accountReportingStatus);
        when(dateService.getLocalDateTime()).thenReturn(now);

        service.submitReportingStatus(accountId, reportingStatusHistoryCreationDTO, year, appUser);

        assertThat(accountReportingStatus.getReportingStatusHistoryList()).hasSize(1);
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getReason()).isEqualTo("reason");
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getStatus()).isEqualTo(MrtmAccountReportingStatus.EXEMPT);
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getSubmitterId()).isEqualTo(appUser.getUserId());
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getSubmitterName()).isEqualTo(appUser.getFullName());
        assertThat(accountReportingStatus.getReportingStatusHistoryList().getFirst().getSubmissionDate()).isEqualTo(now);

        verify(publisher).publishEvent(AccountReportingExemptEvent.builder()
            .accountId(accountId)
            .submitterId(appUser.getUserId())
            .year(year)
            .build()
        );
        verify(reportingStatusRepository).findByAccountIdAndYear(accountId, year);
        verify(reportingStatusRepository).save(accountReportingStatus);
        verifyNoMoreInteractions(accountQueryService, reportingStatusRepository, publisher);
    }

    @Test
    void submitReportingStatus_account_not_found() {
        Long accountId = 1L;
        Year year = Year.now();
        final AccountReportingStatusHistoryCreationDTO reportingStatusHistoryCreationDTO =
                AccountReportingStatusHistoryCreationDTO.builder().status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT).reason("reason").build();
        final AppUser appUser = AppUser.builder().roleType(RoleTypeConstants.REGULATOR).userId("userId").firstName("first name").lastName("last name").build();

        BusinessException businessException = assertThrows(
                BusinessException.class, () -> service.submitReportingStatus(accountId, reportingStatusHistoryCreationDTO, year, appUser));
        assertThat(businessException.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
    }

    @ParameterizedTest
    @EnumSource(MrtmAccountReportingStatus.class)
    void test_same_reporting_status_throws_exception(MrtmAccountReportingStatus reportingStatus) {
        Long accountId = 1L;
        Year year = Year.now();
        final AccountReportingStatusHistoryCreationDTO reportingStatusHistoryCreationDTO = AccountReportingStatusHistoryCreationDTO
            .builder().status(reportingStatus).reason("reason").build();
        final AppUser appUser = AppUser.builder().roleType(RoleTypeConstants.REGULATOR).userId("userId").firstName("first name").lastName("last name").build();
        AccountReportingStatus accountReportingStatus = AccountReportingStatus.builder().status(reportingStatus).build();

        when(reportingStatusRepository.findByAccountIdAndYear(accountId, year))
            .thenReturn(accountReportingStatus);

        BusinessException businessException = assertThrows(
                BusinessException.class,
                () -> service.submitReportingStatus(accountId, reportingStatusHistoryCreationDTO, year, appUser));

        assertThat(businessException.getErrorCode()).isEqualTo(MrtmErrorCode.ACCOUNT_REPORTING_STATUS_NOT_CHANGED);

        assertThat(accountReportingStatus.getReportingStatusHistoryList()).hasSize(0);

        verify(reportingStatusRepository).findByAccountIdAndYear(accountId, year);
        verifyNoMoreInteractions(accountQueryService, reportingStatusRepository, publisher);
        verifyNoInteractions(publisher);
    }

    @Test
    void submitReportingStatus() {
        Long accountId = 1L;
        Year year = Year.now();
        String submitterId = "id";
        String submitterName = "name";
        LocalDateTime now = LocalDateTime.now();

        final MrtmAccount account = MrtmAccount.builder().build();

        when(accountQueryService.getAccountById(accountId)).thenReturn(account);
        when(dateService.getLocalDateTime()).thenReturn(now);
        when(reportingStatusRepository.existsByAccountIdAndYear(accountId, year))
            .thenReturn(false);

        service.submitReportingStatus(accountId, submitterId, submitterName, year);

        // Assertions
        assertThat(account.getReportingStatusList()).hasSize(1);
        assertThat(account.getReportingStatusList().getFirst().getStatus()).isEqualTo(MrtmAccountReportingStatus.REQUIRED_TO_REPORT);
        assertThat(account.getReportingStatusList().getFirst().getReason()).isNull();
        assertThat(account.getReportingStatusList().getFirst().getYear()).isEqualTo(year);
        assertThat(account.getReportingStatusList().getFirst().getLastUpdate()).isEqualTo(now);
        assertThat(account.getReportingStatusList().getFirst().getReportingStatusHistoryList().getFirst().getSubmitterId()).isEqualTo(submitterId);
        assertThat(account.getReportingStatusList().getFirst().getReportingStatusHistoryList().getFirst().getSubmitterName()).isEqualTo(submitterName);
        assertThat(account.getReportingStatusList().getFirst().getReportingStatusHistoryList().getFirst().getSubmissionDate()).isEqualTo(now);

        // Verify interactions
        verify(accountQueryService).getAccountById(accountId);
        verify(reportingStatusRepository).existsByAccountIdAndYear(accountId, year);
        verifyNoMoreInteractions(accountQueryService, reportingStatusRepository);
        verifyNoInteractions(publisher);
    }


    @Test
    void submitReportingStatus_exists() {
        Long accountId = 1L;
        Year year = Year.now();
        String submitterId = "id";
        String submitterName = "name";

        when(reportingStatusRepository.existsByAccountIdAndYear(accountId, year))
            .thenReturn(true);

        service.submitReportingStatus(accountId, submitterId, submitterName, year);


        // Verify interactions
        verify(reportingStatusRepository).existsByAccountIdAndYear(accountId, year);
        verifyNoMoreInteractions(reportingStatusRepository);
        verifyNoInteractions(publisher, accountQueryService);
    }
}
