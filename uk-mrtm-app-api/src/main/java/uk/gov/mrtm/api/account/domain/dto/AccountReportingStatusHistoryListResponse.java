package uk.gov.mrtm.api.account.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Year;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountReportingStatusHistoryListResponse {

    private Map<Year, List<AccountReportingStatusHistoryDTO>> reportingStatusHistoryList;
}
