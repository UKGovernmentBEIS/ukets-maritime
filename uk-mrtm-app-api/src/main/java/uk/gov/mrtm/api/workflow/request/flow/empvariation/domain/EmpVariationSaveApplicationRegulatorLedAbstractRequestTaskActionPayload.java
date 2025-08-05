package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpVariationSaveApplicationRegulatorLedAbstractRequestTaskActionPayload extends RequestTaskActionPayload {

    private EmissionsMonitoringPlan emissionsMonitoringPlan;

    private EmpVariationDetails empVariationDetails;

    private String empVariationDetailsCompleted;

    @Builder.Default
    private Map<String, String> empSectionsCompleted = new HashMap<>();
}
