package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
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
public class ExternalAerDataGapsMethodologies {

    @NotNull
    @Schema(description = "Indicates if a data gap method required during the reporting year")
    private Boolean methodRequired;

    @Schema(description = "Indicates if the data gap method already been approved by the regulator. Required only when 'methodRequired' is true, otherwise must be omitted")
    private Boolean methodApproved;

    @Schema(description = "Indicates if the method used was conservative. Required only when 'methodApproved' is false, otherwise must be omitted")
    private Boolean methodConservative;

    @Size(max = 10000)
    @Schema(description = "Non conservative method details. Required only when 'methodConservative' is false, otherwise must be omitted")
    private String noConservativeMethodDetails;

    @Schema(description = "Indicates if method lead to a material misstatement. Required only when 'methodApproved' is false, otherwise must be omitted")
    private Boolean materialMisstatementExist;

    @Size(max = 10000)
    @Schema(description = "Material misstatement details. Required only when 'materialMisstatementExist' is true, otherwise must be omitted")
    private String materialMisstatementDetails;
}
