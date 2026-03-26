package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@EqualsAndHashCode
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#accuracyCompliant) == (#accuracyNonCompliantReason != null)}", message = "aerVerificationData.complianceMonitoringReportingRules.accuracyCompliant.reason")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#completenessCompliant) == (#completenessNonCompliantReason != null)}", message = "aerVerificationData.complianceMonitoringReportingRules.completenessCompliant.reason")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#consistencyCompliant) == (#consistencyNonCompliantReason != null)}", message = "aerVerificationData.complianceMonitoringReportingRules.consistencyCompliant.reason")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#comparabilityCompliant) == (#comparabilityNonCompliantReason != null)}", message = "aerVerificationData.complianceMonitoringReportingRules.comparabilityCompliant.reason")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#transparencyCompliant) == (#transparencyNonCompliantReason != null)}", message = "aerVerificationData.complianceMonitoringReportingRules.transparencyCompliant.reason")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#integrityCompliant) == (#integrityNonCompliantReason != null)}", message = "aerVerificationData.complianceMonitoringReportingRules.integrityCompliant.reason")
public class ExternalAerComplianceMonitoringReporting {

    @NotNull
    @Schema(description = "Indicates the accuracy of the report")
    private Boolean accuracyCompliant;
    @Schema(description = "Reason report was not accurate. Required only when 'accuracyCompliant' is false, otherwise must be omitted")
    @Size(max = 10000)
    private String accuracyNonCompliantReason;

    @NotNull
    @Schema(description = "Indicates the completeness of the report")
    private Boolean completenessCompliant;
    @Schema(description = "Reason report was not complete. Required only when 'completenessCompliant' is false, otherwise must be omitted")
    @Size(max = 10000)
    private String completenessNonCompliantReason;

    @NotNull
    @Schema(description = "Indicates the consistency of report")
    private Boolean consistencyCompliant;
    @Schema(description = "Reason report was not consistent. Required only when 'consistencyCompliant' is false, otherwise must be omitted")
    @Size(max = 10000)
    private String consistencyNonCompliantReason;

    @NotNull
    @Schema(description = "Indicates the comparability of report")
    private Boolean comparabilityCompliant;
    @Schema(description = "Reason report was not comparable. Required only when 'comparabilityCompliant' is false, otherwise must be omitted")
    @Size(max = 10000)
    private String comparabilityNonCompliantReason;

    @NotNull
    @Schema(description = "Indicates the transparency of report")
    private Boolean transparencyCompliant;
    @Schema(description = "Reason report was not transparent. Required only when 'transparencyCompliant' is false, otherwise must be omitted")
    @Size(max = 10000)
    private String transparencyNonCompliantReason;

    @NotNull
    @Schema(description = "Indicates the integrity of methodology")
    private Boolean integrityCompliant;
    @Schema(description = "Reason report lacked integrity. Required only when 'integrityCompliant' is false, otherwise must be omitted")
    @Size(max = 10000)
    private String integrityNonCompliantReason;
}
