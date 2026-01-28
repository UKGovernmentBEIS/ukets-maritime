package uk.gov.mrtm.api.workflow.request.flow.registry.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOperatorDetails {

    private Integer registryId;
    private Integer firstYearOfVerifiedEmissions;
    private String monitoringPlanId;
    private String accountName;
    private String companyImoNumber;
}