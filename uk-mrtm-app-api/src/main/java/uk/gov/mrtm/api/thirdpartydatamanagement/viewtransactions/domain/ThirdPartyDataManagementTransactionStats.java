package uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThirdPartyDataManagementTransactionStats {

    private long totalImports;
    private long totalCompletedImports;
    private long totalCompletedWithFailuresImports;
    private long totalFailedImports;
    private long totalInProgressImports;
}
