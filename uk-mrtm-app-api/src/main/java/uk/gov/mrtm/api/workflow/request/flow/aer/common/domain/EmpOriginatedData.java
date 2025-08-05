package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmpOriginatedData {

    private EmpOperatorDetails operatorDetails;

    @Builder.Default
    private Map<UUID, String> operatorDetailsAttachments = new HashMap<>();
}
