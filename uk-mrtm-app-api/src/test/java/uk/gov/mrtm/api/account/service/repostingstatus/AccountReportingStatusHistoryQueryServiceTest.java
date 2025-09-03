package uk.gov.mrtm.api.account.service.repostingstatus;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.AccountReportingStatus;
import uk.gov.mrtm.api.account.domain.AccountReportingStatusHistory;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryDTO;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryListResponse;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusHistoryQueryService;
import uk.gov.mrtm.api.account.transform.AccountReportingStatusHistoryMapper;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountReportingStatusHistoryQueryServiceTest {

    @InjectMocks
    private AccountReportingStatusHistoryQueryService service;

    @Mock
    private AccountReportingStatusHistoryMapper mapper;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Test
    void getReportingStatusHistoryListResponse() {
        Long accountId = 1L;
        MrtmAccountReportingStatus status = MrtmAccountReportingStatus.REQUIRED_TO_REPORT;
        String reason = "reason";
        String submitterName = "submitterName";
        LocalDateTime submissionDate = LocalDateTime.now();
        Year year = Year.now();

        when(mapper.toReportingStatusHistoryDTO(anyList())).thenReturn(List.of(AccountReportingStatusHistoryDTO.builder()
                .status(status)
                .reason(reason)
                .submitterName(submitterName)
                .submissionDate(submissionDate)
                .build()));

        List<AccountReportingStatusHistory> reportingStatusHistoryList = List.of(AccountReportingStatusHistory.builder()
                        .status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT)
                        .reason("reason")
                        .submitterName("submitterName")
                        .submissionDate(submissionDate)
                        .build());

        Map<Year, List<AccountReportingStatusHistoryDTO>> historyList
                = Map.of(Year.now(), List.of(AccountReportingStatusHistoryDTO.builder()
                .status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT)
                .reason("reason")
                .submitterName("submitterName")
                .submissionDate(submissionDate)
                .build()));

        when(mrtmAccountQueryService.getAccountById(accountId))
                .thenReturn(MrtmAccount.builder().id(accountId).reportingStatusList(
                        List.of(AccountReportingStatus.builder().year(year).reportingStatusHistoryList(reportingStatusHistoryList
                        ).build()))
                    .build()
                );

        final AccountReportingStatusHistoryListResponse expectedHistoryResponse = AccountReportingStatusHistoryListResponse.builder()
                .reportingStatusHistoryList(historyList)
                .build();

        final AccountReportingStatusHistoryListResponse actualHistoryResponse = service.getReportingStatusHistoryListResponse(accountId);

        assertEquals(expectedHistoryResponse, actualHistoryResponse);
    }

    @Test
    void getReportingStatusHistory_no_results() {
        Long accountId = 1L;

        when(mrtmAccountQueryService.getAccountById(accountId))
                .thenReturn(MrtmAccount.builder().id(accountId).build()
                );

        final AccountReportingStatusHistoryListResponse expectedHistoryResponse = AccountReportingStatusHistoryListResponse.builder()
                .reportingStatusHistoryList(Map.of())
                .build();

        final AccountReportingStatusHistoryListResponse actualHistoryResponse = service.getReportingStatusHistoryListResponse(accountId);

        assertEquals(expectedHistoryResponse, actualHistoryResponse);
    }
}
