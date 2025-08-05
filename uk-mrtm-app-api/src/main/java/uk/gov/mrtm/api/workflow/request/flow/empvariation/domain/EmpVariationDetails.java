package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#changes.contains('OTHER_SIGNIFICANT')) == (#otherSignificantChangeReason != null)}",
    message = "emp.variation.significant.changes.reason")
@SpELExpression(expression = "{(#changes.contains('OTHER_NON_SIGNIFICANT')) == (#otherNonSignificantChangeReason != null)}",
    message = "emp.variation.non.significant.changes.reason")
public class EmpVariationDetails {

	@NotBlank
    @Size(max=10000)
	private String reason;
	
    @Builder.Default
    @NotEmpty
    private List<EmpVariationChangeType> changes = new ArrayList<>();

    @Size(max=10000)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String otherSignificantChangeReason;

    @Size(max=10000)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String otherNonSignificantChangeReason;
}
