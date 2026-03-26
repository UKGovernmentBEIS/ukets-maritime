package uk.gov.mrtm.api.emissionsmonitoringplan.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class EmpApprovedEvent {

    private Long accountId;
    private EmissionsMonitoringPlan emissionsMonitoringPlan;
}
