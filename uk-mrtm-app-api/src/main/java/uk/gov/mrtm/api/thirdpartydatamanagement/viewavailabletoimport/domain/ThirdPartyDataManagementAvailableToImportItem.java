package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThirdPartyDataManagementAvailableToImportItem {

    private Long id;
    private Long accountId;
    private String name;
    private String imoNumber;
    private LocalDateTime receivedOn;
    private String providerName;
    private ThirdPartyDataManagementItemType itemType;

    public ThirdPartyDataManagementAvailableToImportItem(Long id, ThirdPartyDataRequestType requestType, Long accountId, String name, String imoNumber,
                                                         Year year, String providerName, LocalDateTime receivedOn) {
        this.id = id;
        this.accountId = accountId;
        this.name = name;
        this.imoNumber = imoNumber;
        this.itemType = Objects.equals(requestType, ThirdPartyDataRequestType.AER)
            ? ThirdPartyDataManagementReportingItemType.builder().year(year).requestType(requestType).build()
            : ThirdPartyDataManagementBaseItemType.builder().requestType(requestType).build();
        this.providerName = providerName;
        this.receivedOn = receivedOn;
    }
}
