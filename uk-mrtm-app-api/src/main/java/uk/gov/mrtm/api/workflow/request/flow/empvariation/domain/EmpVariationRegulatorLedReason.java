package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{(#type eq 'OTHER') == (#reasonOtherSummary != null)}",
	message = "emp.variation.submit.regulator.led.reason.typeOtherSummary")
public class EmpVariationRegulatorLedReason {
	
	@NotNull
	private EmpVariationRegulatorLedReasonType type;
	
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	@Size(max=10000)
	private String reasonOtherSummary;

	@NotBlank
	@Size(max = 10000)
	private String summary;

	@JsonIgnore
	public String getDocumentReason() {
		if (EmpVariationRegulatorLedReasonType.OTHER.equals(type)) {
			return type.getDescription() + reasonOtherSummary;
		} else {
			return type.getDescription();
		}
	}
}
