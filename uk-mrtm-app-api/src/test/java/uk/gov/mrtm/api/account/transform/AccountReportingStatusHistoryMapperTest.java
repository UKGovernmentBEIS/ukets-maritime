package uk.gov.mrtm.api.account.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.account.domain.AccountReportingStatusHistory;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryDTO;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class AccountReportingStatusHistoryMapperTest {

    private final AccountReportingStatusHistoryMapper mapper = Mappers.getMapper(AccountReportingStatusHistoryMapper.class);

    @Test
    void toReportingStatusHistoryDTO() {
        AccountReportingStatusHistory reportingStatusHistory = AccountReportingStatusHistory.builder()
                .reason("reason")
                .status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT)
                .submissionDate(LocalDateTime.now())
                .submitterName("submitter")
                .build();

        List<AccountReportingStatusHistoryDTO> result = mapper.toReportingStatusHistoryDTO(List.of(reportingStatusHistory));

        assertThat(result).isEqualTo(List.of(AccountReportingStatusHistoryDTO.builder()
                .reason(reportingStatusHistory.getReason())
                .status(reportingStatusHistory.getStatus())
                .submissionDate(reportingStatusHistory.getSubmissionDate())
                .submitterName(reportingStatusHistory.getSubmitterName())
                .build()));
    }
}
