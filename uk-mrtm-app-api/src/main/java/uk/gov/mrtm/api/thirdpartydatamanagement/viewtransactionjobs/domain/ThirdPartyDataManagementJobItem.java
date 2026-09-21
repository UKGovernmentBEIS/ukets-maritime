package uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThirdPartyDataManagementJobItem {

    private String operatorName;
    private String status;
    private String failureReason;

    public ThirdPartyDataManagementJobItem(String operatorName, ThirdPartyDataManagementImportResult status) {
        this.operatorName = operatorName;
        this.status = status.getCategoryShortDescription();
        this.failureReason = status.getFailureReason();
    }
}
