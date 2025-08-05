package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpAccountDTO;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpAccountDTOImpl implements EmpAccountDTO {

	private String empId;
	private Long accountId;
	
}
