package uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThirdPartyDataManagementTransactionsResponseDTO {

    private ThirdPartyDataManagementTransactionStats stats;

    private List<ThirdPartyDataManagementTransactionItem> items;
}
