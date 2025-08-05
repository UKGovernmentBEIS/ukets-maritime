package uk.gov.mrtm.api.account.service.reportingstatus;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.AccountReportingStatus;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryDTO;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryListResponse;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.account.transform.AccountReportingStatusHistoryMapper;
import uk.gov.netz.api.account.service.validator.AccountStatus;

import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountReportingStatusHistoryQueryService {

    private final AccountReportingStatusHistoryMapper mapper;

    private final MrtmAccountQueryService mrtmAccountQueryService;

    @Transactional
    @AccountStatus(expression = "{#status != 'CLOSED'}")
    public AccountReportingStatusHistoryListResponse getReportingStatusHistoryListResponse(Long accountId) {

        List<AccountReportingStatus> accountStatuses = mrtmAccountQueryService.getAccountById(accountId).getReportingStatusList();

        Map<Year, List<AccountReportingStatusHistoryDTO>> reportingStatusHistoryList =
            accountStatuses.stream()
                .collect(Collectors.toMap(
                    AccountReportingStatus::getYear,
                    reportingStatus -> mapper.toReportingStatusHistoryDTO(reportingStatus.getReportingStatusHistoryList())
                ));

        return AccountReportingStatusHistoryListResponse.builder()
                .reportingStatusHistoryList(reportingStatusHistoryList)
                .build();
    }

}
