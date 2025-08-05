package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountIdAndNameDTO;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MrtmAccountIdAndNameDTOImpl implements MrtmAccountIdAndNameDTO {
	
	private Long accountId;
	private String accountName;

}