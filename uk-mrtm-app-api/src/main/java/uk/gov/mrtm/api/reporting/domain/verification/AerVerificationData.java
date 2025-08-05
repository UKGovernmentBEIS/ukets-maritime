package uk.gov.mrtm.api.reporting.domain.verification;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AerVerificationData {

    @NotNull
    @Valid
    private AerVerifierContact verifierContact;

    @NotNull
    @Valid
    private AerVerificationTeamDetails verificationTeamDetails;

    @NotNull
    @Valid
    private AerOpinionStatement opinionStatement;

    @NotNull
    @Valid
    private AerUncorrectedNonCompliances uncorrectedNonCompliances;

    @NotNull
    @Valid
    private AerUncorrectedMisstatements uncorrectedMisstatements;

    @NotNull
    @Valid
    private AerVerificationDecision overallDecision;

    @NotNull
    @Valid
    private AerUncorrectedNonConformities uncorrectedNonConformities;

    @NotNull
    @Valid
    private AerRecommendedImprovements recommendedImprovements;

    @NotNull
    @Valid
    private AerMaterialityLevel materialityLevel;

    @NotNull
    @Valid
    private AerEtsComplianceRules etsComplianceRules;

    @NotNull
    @Valid
    private AerComplianceMonitoringReporting complianceMonitoringReporting;

    //TODO fill this report with all verifier subtasks

    @NotNull
    @Valid
    private AerDataGapsMethodologies dataGapsMethodologies;

    @JsonIgnore
    public boolean isValidForVir() {

        if (uncorrectedNonConformities == null || recommendedImprovements == null) {
            return false;
        }
        return Boolean.TRUE.equals(uncorrectedNonConformities.getExist()) ||
                Boolean.TRUE.equals(uncorrectedNonConformities.getExistPriorYearIssues()) ||
                Boolean.TRUE.equals(recommendedImprovements.getExist());
    }
}
