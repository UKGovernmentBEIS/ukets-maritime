package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class EmpVariationSaveApplicationAbstractRequestTaskActionPayload extends RequestTaskActionPayload {

	private EmissionsMonitoringPlan emissionsMonitoringPlan;
    
    private EmpVariationDetails empVariationDetails;
	
	private String empVariationDetailsCompleted;
}
