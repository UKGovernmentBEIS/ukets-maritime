package uk.gov.mrtm.api.account.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountReportingStatusHistoryDTO {

    private MrtmAccountReportingStatus status;

    private String reason;

    private String submitterName;

    private LocalDateTime submissionDate;
}
