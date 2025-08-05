package uk.gov.mrtm.api.account.service.reportingstatus;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.AccountReportingStatus;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusDTO;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusListResponse;
import uk.gov.mrtm.api.account.repository.AccountReportingStatusRepository;
import uk.gov.mrtm.api.account.transform.AccountReportingStatusMapper;
import uk.gov.netz.api.account.service.validator.AccountStatus;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class AccountReportingStatusQueryService {
    private final AccountReportingStatusRepository repository;

    private final AccountReportingStatusMapper mapper;

    @Transactional(readOnly = true)
    public AccountReportingStatusListResponse getAllReportingStatuses(Long accountId, Integer page, Integer pageSize) {
        Page<AccountReportingStatus> reportingStatusList =
                repository.findByAccountIdOrderByYearDesc(PageRequest.of(page, pageSize), accountId);

        return AccountReportingStatusListResponse.builder()
                .reportingStatusList(reportingStatusList.get().map(mapper::toReportingStatusDTOIgnoreReason).toList())
                .total(reportingStatusList.getTotalElements())
                .build();
    }

    @Transactional
    @AccountStatus(expression = "{#status != 'CLOSED'}")
    public AccountReportingStatusDTO getReportingStatusByYear(Long accountId, Year reportingYear) {
        AccountReportingStatus accountReportingStatus = repository.findByAccountIdAndYear(accountId, reportingYear);

        if (accountReportingStatus == null) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
        }

        return mapper.toReportingStatusDTO(accountReportingStatus);
    }
}
