package uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountClosure {
	
	@NotBlank
    @Size(max = 2000)
    private String reason;
}
