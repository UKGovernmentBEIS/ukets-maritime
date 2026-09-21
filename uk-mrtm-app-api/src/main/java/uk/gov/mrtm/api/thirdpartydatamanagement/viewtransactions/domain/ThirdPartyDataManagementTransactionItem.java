package uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementBaseItemType;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementItemType;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementReportingItemType;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThirdPartyDataManagementTransactionItem {

    private Long id;
    private LocalDateTime createdOn;
    private String submitterName;
    private ThirdPartyDataManagementItemType itemType;
    private ThirdPartyDataTransactionStatus status;

    public ThirdPartyDataManagementTransactionItem(Long id, LocalDateTime createdOn, String submitterName,
                                                   ThirdPartyDataRequestType requestType, Year year,
                                                   ThirdPartyDataTransactionStatus status) {
        this.id = id;
        this.createdOn = createdOn;
        this.submitterName = submitterName;
        this.itemType = Objects.equals(requestType, ThirdPartyDataRequestType.AER)
            ? ThirdPartyDataManagementReportingItemType.builder().year(year).requestType(requestType).build()
            : ThirdPartyDataManagementBaseItemType.builder().requestType(requestType).build();
        this.status = status;
    }
}
