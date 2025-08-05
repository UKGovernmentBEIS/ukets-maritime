package uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmissionsMonitoringPlanDTO {

    private String id;

    private Long accountId;

    private int consolidationNumber;

    private EmissionsMonitoringPlanContainer empContainer;
}
