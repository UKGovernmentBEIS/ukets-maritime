package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#type eq 'APPROVED') || (#type eq 'REJECTED' && #reason != null) || (#type eq 'DEEMED_WITHDRAWN' && #reason != null)}", message = "emp.determination.reason")
@SpELExpression(expression = "{(#type eq 'APPROVED' && #summary != null) || (#type eq 'REJECTED' && #summary != null) || (#type eq 'DEEMED_WITHDRAWN')}", message = "emp.determination.summary")
public class EmpVariationDetermination {
	
	@NotNull
    private EmpVariationDeterminationType type;

    @Size(max = 10000)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String reason;

    @Size(max = 10000)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String summary;
}
