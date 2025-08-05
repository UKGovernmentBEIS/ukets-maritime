package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AerInitiatorRequest {

	@NotNull
	private String requestType;
	
	private LocalDateTime submissionDateTime;
	
}
