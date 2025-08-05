package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpVariationSaveApplicationRequestTaskActionPayload
		extends EmpVariationSaveApplicationAbstractRequestTaskActionPayload {

	@Builder.Default
	private Map<String, String> empSectionsCompleted = new HashMap<>();

	@Builder.Default
	private Set<EmpReviewGroup> updatedSubtasks = new HashSet<>();
}
