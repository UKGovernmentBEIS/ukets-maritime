package uk.gov.mrtm.api.account.service.reportingstatus;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.account.domain.AccountReportingExemptEvent;
import uk.gov.mrtm.api.account.domain.AccountReportingRequiredEvent;
import uk.gov.mrtm.api.account.domain.AccountReportingStatus;
import uk.gov.mrtm.api.account.domain.AccountReportingStatusHistory;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryCreationDTO;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;
import uk.gov.mrtm.api.account.repository.AccountReportingStatusRepository;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.integration.registry.accountexempt.domain.AccountExemptEvent;
import uk.gov.mrtm.api.integration.registry.accountexempt.request.MaritimeAccountExemptEventListenerResolver;
import uk.gov.netz.api.account.service.validator.AccountStatus;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.utils.DateService;

import java.time.LocalDateTime;
import java.time.Year;

@Validated
@Service
@RequiredArgsConstructor
public class AccountReportingStatusHistoryCreationService {

    private final MrtmAccountQueryService accountQueryService;
    private final DateService dateService;
    private final MaritimeAccountExemptEventListenerResolver accountExemptEventListenerResolver;
    private final ApplicationEventPublisher publisher;
    private final AccountReportingStatusRepository reportingStatusRepository;
    private final AccountReportingStatusRepository accountReportingStatusRepository;

    @Transactional
    @AccountStatus(expression = "{#status != 'CLOSED'}")
    public void submitReportingStatus(Long accountId,
                                      @Valid AccountReportingStatusHistoryCreationDTO reportingStatusHistoryCreationDTO,
                                      Year year,
                                      AppUser appUser) {
        final AccountReportingStatus reportingStatusForGivenYear =
            reportingStatusRepository.findByAccountIdAndYear(accountId, year);

        if (reportingStatusForGivenYear == null) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
        }

        final MrtmAccountReportingStatus currentReportingStatus = reportingStatusForGivenYear.getStatus();
        final MrtmAccountReportingStatus newReportingStatus = reportingStatusHistoryCreationDTO.getStatus();

        if (!newReportingStatus.equals(currentReportingStatus)) {

            LocalDateTime now = dateService.getLocalDateTime();

            // Add the new account reporting history status item
            AccountReportingStatusHistory accountReportingStatusHistory = AccountReportingStatusHistory.builder()
                    .status(newReportingStatus)
                    .submissionDate(now)
                    .reason(reportingStatusHistoryCreationDTO.getReason())
                    .submitterId(appUser.getUserId())
                    .submitterName(appUser.getFullName())
                    .build();

            //Set the latest reporting status history to the reporting status of the account
            reportingStatusForGivenYear.setStatus(newReportingStatus);
            reportingStatusForGivenYear.setReason(reportingStatusHistoryCreationDTO.getReason());
            reportingStatusForGivenYear.setLastUpdate(now);

            reportingStatusForGivenYear.addReportingStatusHistory(accountReportingStatusHistory);
            reportingStatusRepository.save(reportingStatusForGivenYear);

            publishReportingStatusChangedEvent(accountId, currentReportingStatus, newReportingStatus,
                year, appUser.getUserId());

            sendAccountExemptRegistryEvent(accountId, year, newReportingStatus);

        } else {
            throw new BusinessException(MrtmErrorCode.ACCOUNT_REPORTING_STATUS_NOT_CHANGED, accountId,
                    reportingStatusHistoryCreationDTO.getStatus());
        }
    }

    @Transactional
    @AccountStatus(expression = "{#status != 'CLOSED'}")
    public void submitReportingStatus(Long accountId, String submitterId, String submitterName, Year year) {
        if (accountReportingStatusRepository.existsByAccountIdAndYear(accountId, year)) {
            return;
        }

        final MrtmAccount account = accountQueryService.getAccountById(accountId);

        MrtmAccountReportingStatus defaultReportingStatus = MrtmAccountReportingStatus.REQUIRED_TO_REPORT;
        LocalDateTime now = dateService.getLocalDateTime();

        AccountReportingStatus accountReportingStatus = AccountReportingStatus.builder()
            .status(defaultReportingStatus)
            .year(year)
            .lastUpdate(now)
            .account(account)
            .build();

        accountReportingStatus.addReportingStatusHistory(
            AccountReportingStatusHistory.builder()
                .status(defaultReportingStatus)
                .submitterId(submitterId)
                .submitterName(submitterName)
                .submissionDate(now)
                .build());

        account.addReportingStatus(accountReportingStatus);
    }

    private void publishReportingStatusChangedEvent(Long accountId,
                                                    MrtmAccountReportingStatus currentReportingStatus,
                                                    MrtmAccountReportingStatus newReportingStatus,
                                                    Year year,
                                                    String submitterId) {
        //if change from REQUIRED_TO_REPORT to EXEMPT
        if (MrtmAccountReportingStatus.REQUIRED_TO_REPORT == currentReportingStatus) {
            publisher.publishEvent(AccountReportingExemptEvent.builder()
                .accountId(accountId)
                .year(year)
                .submitterId(submitterId)
                .build()
            );
        }

        if (MrtmAccountReportingStatus.REQUIRED_TO_REPORT == newReportingStatus) {
            publisher.publishEvent(AccountReportingRequiredEvent.builder()
                .accountId(accountId)
                .submitterId(submitterId)
                .year(year)
                .build()
            );
        }
    }

    private void sendAccountExemptRegistryEvent(Long accountId, Year year, MrtmAccountReportingStatus newReportingStatus) {
        accountExemptEventListenerResolver.onAccountExemptEvent(AccountExemptEvent.builder()
            .accountId(accountId)
            .isExempt(!newReportingStatus.equals(MrtmAccountReportingStatus.REQUIRED_TO_REPORT))
            .year(year)
            .build());
    }
}
