package uk.gov.mrtm.api.reporting.domain.common;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Year;

@Data
@Builder
public class ReportableEmissionsUpdatedEvent {
    private Long accountId;
    private Year year;
    private BigDecimal reportableEmissions;
    private boolean isFromDoe;
    private boolean isFromRegulator;
}
