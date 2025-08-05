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
public class AerEtsComplianceRules {

    @NotNull
    private Boolean monitoringPlanRequirementsMet;
    @Size(max = 10000)
    private String monitoringPlanRequirementsNotMetReason;

    @NotNull
    private Boolean etsOrderRequirementsMet;
    @Size(max = 10000)
    private String etsOrderRequirementsNotMetReason;

    @NotNull
    private Boolean detailSourceDataVerified;
    @Size(max = 10000)
    private String detailSourceDataNotVerifiedReason;
    @Size(max = 10000)
    private String partOfSiteVerification;

    @NotNull
    private Boolean controlActivitiesDocumented;
    @Size(max = 10000)
    private String controlActivitiesNotDocumentedReason;

    @NotNull
    private Boolean proceduresMonitoringPlanDocumented;
    @Size(max = 10000)
    private String proceduresMonitoringPlanNotDocumentedReason;

    @NotNull
    private Boolean dataVerificationCompleted;
    @Size(max = 10000)
    private String dataVerificationNotCompletedReason;

    @NotNull
    private Boolean monitoringApproachAppliedCorrectly;
    @Size(max = 10000)
    private String monitoringApproachNotAppliedCorrectlyReason;


    @NotNull
    private Boolean methodsApplyingMissingDataUsed;
    @Size(max = 10000)
    private String methodsApplyingMissingDataNotUsedReason;

    @NotNull
    private Boolean competentAuthorityGuidanceMet;
    @Size(max = 10000)
    private String competentAuthorityGuidanceNotMetReason;

    @NotNull
    private NonConformities nonConformities;
    @Size(max = 10000)
    private String nonConformitiesDetails;
}
