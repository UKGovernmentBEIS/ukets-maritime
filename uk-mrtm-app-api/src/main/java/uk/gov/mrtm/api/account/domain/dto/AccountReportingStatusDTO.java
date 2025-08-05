package uk.gov.mrtm.api.account.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;

import java.time.LocalDateTime;
import java.time.Year;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountReportingStatusDTO {

    private MrtmAccountReportingStatus status;

    private Year year;

    private String reason;

    private LocalDateTime lastUpdate;

    private Long accountId;

    private boolean isReported;
}
