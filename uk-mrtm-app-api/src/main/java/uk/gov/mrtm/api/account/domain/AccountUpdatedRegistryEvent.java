package uk.gov.mrtm.api.account.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountUpdatedRegistryEvent {

    private Long accountId;
    private EmissionsMonitoringPlan emissionsMonitoringPlan;
}
