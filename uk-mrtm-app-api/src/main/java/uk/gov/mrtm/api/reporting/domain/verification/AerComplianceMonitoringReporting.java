package uk.gov.mrtm.api.reporting.domain.verification;

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
public class AerComplianceMonitoringReporting {

    @NotNull
    private Boolean accuracyCompliant;
    @Size(max = 10000)
    private String accuracyNonCompliantReason;

    @NotNull
    private Boolean completenessCompliant;
    @Size(max = 10000)
    private String completenessNonCompliantReason;

    @NotNull
    private Boolean consistencyCompliant;
    @Size(max = 10000)
    private String consistencyNonCompliantReason;

    @NotNull
    private Boolean comparabilityCompliant;
    @Size(max = 10000)
    private String comparabilityNonCompliantReason;

    @NotNull
    private Boolean transparencyCompliant;
    @Size(max = 10000)
    private String transparencyNonCompliantReason;

    @NotNull
    private Boolean integrityCompliant;
    @Size(max = 10000)
    private String integrityNonCompliantReason;
}
