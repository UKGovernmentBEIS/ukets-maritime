package uk.gov.mrtm.api.workflow.request.flow.vir.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "#improvementRequired == (#improvementDeadline != null)", message = "regulatorImprovementResponse.improvementRequired")
public class RegulatorImprovementResponse {

    private boolean improvementRequired;

    private LocalDate improvementDeadline;

    @Size(max = 10000)
    private String improvementComments;

    @NotNull
    @Size(max = 10000)
    private String operatorActions;
}
