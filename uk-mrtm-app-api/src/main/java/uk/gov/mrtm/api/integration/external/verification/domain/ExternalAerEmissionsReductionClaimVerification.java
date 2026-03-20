package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
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
public class ExternalAerEmissionsReductionClaimVerification {

    @NotNull
    @Schema(description = "Indicates if maritime operator's eligible fuel batch claims has been reviewed")
    private Boolean smfBatchClaimsReviewed;

    @Size(max = 10000)
    @Schema(description = "List the batch references that were not reviewed. Required only when 'smfBatchClaimsReviewed' is false, otherwise must be omitted")
    private String batchReferencesNotReviewed;

    @Size(max = 10000)
    @Schema(description = "Describes how data sampling was carried out and what documents were reviewed. Required only when 'smfBatchClaimsReviewed' is false, otherwise must be omitted")
    private String dataSampling;

    @NotBlank
    @Size(min = 1, max = 10000)
    @Schema(description = "Describes the results of your review. State if: the emissions reduction claim is supported by sufficient and appropriate internal and external evidence and the amount of reductions from the use of eligible fuel is fair and accurate")
    private String reviewResults;

    @NotBlank
    @Size(min = 1, max = 10000)
    @Schema(description = "Describes the steps taken to confirm none of the eligible fuel included in the emissions reduction claim relating to the scheme year had been sold or used elsewhere by the maritime operator to claim an emission reduction, or financial benefit, in any other mandatory or voluntary scheme")
    private String noDoubleCountingConfirmation;

    @NotNull
    @Schema(description = "Indicates if all of the batch claims reviewed contain evidence that shows the eligibility criteria were met")
    private Boolean evidenceAllCriteriaMetExist;

    @Size(max = 10000)
    @Schema(description = "Identified issues. Required only when 'evidenceAllCriteriaMetExist' is false, otherwise must be omitted")
    private String noCriteriaMetIssues;

    @NotNull
    @Schema(description = "Indicates if the maritime operator’s emissions reduction claim is compliant with their emissions monitoring plan, the legislation and regulator guidance")
    private Boolean complianceWithEmpRequirementsExist;

    @Size(max = 10000)
    @Schema(description = "Not complied aspects. Required only when 'complianceWithEmpRequirementsExist' is false, otherwise must be omitted")
    private String notCompliedWithEmpRequirementsAspects;
}
