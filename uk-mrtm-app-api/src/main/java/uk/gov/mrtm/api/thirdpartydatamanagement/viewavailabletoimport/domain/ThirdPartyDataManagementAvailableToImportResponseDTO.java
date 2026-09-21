package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThirdPartyDataManagementAvailableToImportResponseDTO {

    private long accountsEligibleForImport;

    private long totalItems;

    private long totalAccounts;

    private List<ThirdPartyDataManagementAvailableToImportItem> items;
}
