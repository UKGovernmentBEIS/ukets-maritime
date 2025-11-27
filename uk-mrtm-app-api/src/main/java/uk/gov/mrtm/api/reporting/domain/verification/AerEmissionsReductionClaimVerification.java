package uk.gov.mrtm.api.reporting.domain.verification;

import jakarta.validation.constraints.NotBlank;
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
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#smfBatchClaimsReviewed) == (#batchReferencesNotReviewed != null)}", message = "aerVerificationData.emissionsReductionClaimVerification.smfBatchClaimsReviewed.referencesNotReviewed")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#smfBatchClaimsReviewed) == (#dataSampling != null)}", message = "aerVerificationData.emissionsReductionClaimVerification.smfBatchClaimsReviewed.dataSampling")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#evidenceAllCriteriaMetExist) == (#noCriteriaMetIssues != null)}", message = "aerVerificationData.emissionsReductionClaimVerification.evidenceAllCriteriaMetExist.issues")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#complianceWithEmpRequirementsExist) == (#notCompliedWithEmpRequirementsAspects != null)}", message = "aerVerificationData.emissionsReductionClaimVerification.complianceWithEmpRequirementsExist.aspects")
public class AerEmissionsReductionClaimVerification {

    @NotNull
    private Boolean smfBatchClaimsReviewed;

    @Size(max = 10000)
    private String batchReferencesNotReviewed;

    @Size(max = 10000)
    private String dataSampling;

    @NotBlank
    @Size(max = 10000)
    private String reviewResults;

    @NotBlank
    @Size(max = 10000)
    private String noDoubleCountingConfirmation;

    @NotNull
    private Boolean evidenceAllCriteriaMetExist;

    @Size(max = 10000)
    private String noCriteriaMetIssues;

    @NotNull
    private Boolean complianceWithEmpRequirementsExist;

    @Size(max = 10000)
    private String notCompliedWithEmpRequirementsAspects;
}
