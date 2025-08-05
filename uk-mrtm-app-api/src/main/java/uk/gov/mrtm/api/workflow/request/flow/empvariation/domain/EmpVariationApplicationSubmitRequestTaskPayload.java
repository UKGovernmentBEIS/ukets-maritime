package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;


@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmpVariationApplicationSubmitRequestTaskPayload extends RequestTaskPayload {

	private EmissionsMonitoringPlan emissionsMonitoringPlan;

	private EmpVariationDetails empVariationDetails;

	private String empVariationDetailsCompleted;

	@Builder.Default
	private Set<EmpReviewGroup> updatedSubtasks = new HashSet<>();
	
	@Builder.Default
	private Map<UUID, String> empAttachments = new HashMap<>();

	@Builder.Default
	private Map<String, String> empSectionsCompleted = new HashMap<>();  

	@Override
	public Set<UUID> getReferencedAttachmentIds() {
		return getEmissionsMonitoringPlan() != null ?
			getEmissionsMonitoringPlan().getEmpSectionAttachmentIds() :
			Collections.emptySet();
	}

	@Override
	public Map<UUID, String> getAttachments() {
		return getEmpAttachments();
	}

}
