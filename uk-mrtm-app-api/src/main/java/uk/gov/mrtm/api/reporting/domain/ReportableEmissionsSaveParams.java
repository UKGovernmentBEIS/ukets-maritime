package uk.gov.mrtm.api.reporting.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Year;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportableEmissionsSaveParams {

    private Long accountId;
    private Year year;
    private AerTotalReportableEmissions reportableEmissions;
    private boolean isFromDoe;
    private boolean isFromRegulator;
    private boolean isExempted;
}
