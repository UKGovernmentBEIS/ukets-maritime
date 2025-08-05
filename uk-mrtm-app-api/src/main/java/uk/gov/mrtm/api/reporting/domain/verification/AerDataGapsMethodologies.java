package uk.gov.mrtm.api.reporting.domain.verification;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#methodRequired) == (#methodApproved != null)}", message = "aerVerificationData.dataGapsMethodologies.methodRequired.methodApproved")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#methodApproved) == (#methodConservative != null)}", message = "aerVerificationData.dataGapsMethodologies.methodApproved.methodConservative")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#methodApproved) == (#materialMisstatementExist != null)}", message = "aerVerificationData.dataGapsMethodologies.methodApproved.materialMisstatementExist")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#methodConservative) == (#noConservativeMethodDetails != null)}", message = "aerVerificationData.dataGapsMethodologies.methodConservative.details")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#materialMisstatementExist) == (#materialMisstatementDetails != null)}", message = "aerVerificationData.dataGapsMethodologies.materialMisstatementExist.details")
public class AerDataGapsMethodologies {

    @NotNull
    private Boolean methodRequired;

    private Boolean methodApproved;

    private Boolean methodConservative;

    @Size(max = 10000)
    private String noConservativeMethodDetails;

    private Boolean materialMisstatementExist;

    @Size(max = 10000)
    private String materialMisstatementDetails;
}
