package uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionItem;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThirdPartyDataManagementTransactionDetailsResponseDTO {

    private ThirdPartyDataManagementTransactionItem transaction;

    private List<ThirdPartyDataManagementJobItem> jobs;
}
