package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.verification.NonConformities;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#monitoringPlanRequirementsMet) == (#monitoringPlanRequirementsNotMetReason != null)}", message = "aerVerificationData.etsComplianceRules.monitoringPlanRequirements")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#etsOrderRequirementsMet) == (#etsOrderRequirementsNotMetReason != null)}", message = "aerVerificationData.etsComplianceRules.etsOrderRequirements")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#detailSourceDataVerified) == (#detailSourceDataNotVerifiedReason != null)}", message = "aerVerificationData.etsComplianceRules.verifyDetailSourceData.reason")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#detailSourceDataVerified) == (#partOfSiteVerification != null)}", message = "aerVerificationData.etsComplianceRules.verifyDetailSourceData.partOfSiteVerification")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#controlActivitiesDocumented) == (#controlActivitiesNotDocumentedReason != null)}", message = "aerVerificationData.etsComplianceRules.controlActivities")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#proceduresMonitoringPlanDocumented) == (#proceduresMonitoringPlanNotDocumentedReason != null)}", message = "aerVerificationData.etsComplianceRules.proceduresMonitoringPlan")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#dataVerificationCompleted) == (#dataVerificationNotCompletedReason != null)}", message = "aerVerificationData.etsComplianceRules.dataVerification")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#monitoringApproachAppliedCorrectly) == (#monitoringApproachNotAppliedCorrectlyReason != null)}", message = "aerVerificationData.etsComplianceRules.monitoringApproachAppliedCorrectly")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#methodsApplyingMissingDataUsed) == (#methodsApplyingMissingDataNotUsedReason != null)}", message = "aerVerificationData.etsComplianceRules.methodsApplyingMissingData")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#competentAuthorityGuidanceMet) == (#competentAuthorityGuidanceNotMetReason != null)}", message = "aerVerificationData.etsComplianceRules.competentAuthorityGuidance")
@SpELExpression(expression = "{(#nonConformities eq 'NO') == (#nonConformitiesDetails != null)}", message = "aerVerificationData.etsComplianceRules.nonConformities")
public class ExternalAerEtsComplianceRules {

    @NotNull
    @Schema(description = "Indicates if the emissions monitoring plan requirements and conditions been met")
    private Boolean monitoringPlanRequirementsMet;
    @Size(max = 10000)
    @Schema(description = "Reason monitoring plan requirements were not met. Required only when 'monitoringPlanRequirementsMet' is false, otherwise must be omitted")
    private String monitoringPlanRequirementsNotMetReason;

    @NotNull
    @Schema(description = "Indicates if the requirements of the UK ETS Order been met")
    private Boolean etsOrderRequirementsMet;
    @Size(max = 10000)
    @Schema(description = "Reason UK ETS Order requirements were not met. Required only when 'etsOrderRequirementsMet' is false, otherwise must be omitted")
    private String etsOrderRequirementsNotMetReason;

    @NotNull
    @Schema(description = "Indicates if the detail and source of data have be verified")
    private Boolean detailSourceDataVerified;
    @Size(max = 10000)
    @Schema(description = "Reason detail and source of data have not be verified. Required only when 'detailSourceDataVerified' is false, otherwise must be omitted")
    private String detailSourceDataNotVerifiedReason;
    @Size(max = 10000)
    @Schema(description = "Part of site verification justification. Required only when 'detailSourceDataVerified' is true, otherwise must be omitted")
    private String partOfSiteVerification;

    @NotNull
    @Schema(description = "Indicates if control activities documented, implemented, maintained and effective to reduce any risks")
    private Boolean controlActivitiesDocumented;
    @Size(max = 10000)
    @Schema(description = "Reason control activities were not documented, implemented, maintained and effective to reduce any risks. Required only when 'controlActivitiesDocumented' is false, otherwise must be omitted")
    private String controlActivitiesNotDocumentedReason;

    @NotNull
    @Schema(description = "Indicates if procedures in the emissions monitoring plan documented, implemented, maintained and effective to reduce any risks")
    private Boolean proceduresMonitoringPlanDocumented;
    @Size(max = 10000)
    @Schema(description = "Reason procedures in the emissions monitoring plan were not documented, implemented, maintained and effective to reduce any risks. Required only when 'proceduresMonitoringPlanDocumented' is false, otherwise must be omitted")
    private String proceduresMonitoringPlanNotDocumentedReason;

    @NotNull
    @Schema(description = "Indicates if data verification has been completed as required")
    private Boolean dataVerificationCompleted;
    @Size(max = 10000)
    @Schema(description = "Reason data verification was not completed as required. Required only when 'dataVerificationCompleted' is false, otherwise must be omitted")
    private String dataVerificationNotCompletedReason;

    @NotNull
    @Schema(description = "Indicates if the monitoring approaches been applied correctly")
    private Boolean monitoringApproachAppliedCorrectly;
    @Size(max = 10000)
    @Schema(description = "Reason monitoring approaches have not been applied correctly. Required only when 'monitoringApproachAppliedCorrectly' is false, otherwise must be omitted")
    private String monitoringApproachNotAppliedCorrectlyReason;

    @NotNull
    @Schema(description = "Indicates if methods used for applying missing data were appropriate")
    private Boolean methodsApplyingMissingDataUsed;
    @Size(max = 10000)
    @Schema(description = "Reason methods used for applying missing data were not appropriate. Required only when 'methodsApplyingMissingDataUsed' is false, otherwise must be omitted")
    private String methodsApplyingMissingDataNotUsedReason;

    @NotNull
    @Schema(description = "Indicates if the regulator guidance has been met")
    private Boolean competentAuthorityGuidanceMet;
    @Size(max = 10000)
    @Schema(description = "Reason regulator guidance has not been met. Required only when 'competentAuthorityGuidanceMet' is false, otherwise must be omitted")
    private String competentAuthorityGuidanceNotMetReason;

    @NotNull
    @Schema(description = "Indicates if non-conformities from last year been corrected")
    private NonConformities nonConformities;
    @Size(max = 10000)
    @Schema(description = "Reason non-conformities from last year have not been corrected. Required only when 'nonConformities' is 'NO', otherwise must be omitted")
    private String nonConformitiesDetails;
}
