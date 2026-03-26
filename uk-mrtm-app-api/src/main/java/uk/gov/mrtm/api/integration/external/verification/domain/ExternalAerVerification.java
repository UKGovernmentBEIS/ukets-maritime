package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
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
public class ExternalAerVerification {

    @NotNull
    @Valid
    @Schema(description = "Verifier contact")
    private ExternalAerVerifierContact verifierContact;

    @NotNull
    @Valid
    @Schema(description = "Verification team details")
    private ExternalAerVerificationTeamDetails verificationTeamDetails;

    @NotNull
    @Valid
    @Schema(description = "Opinion statement")
    private ExternalAerOpinionStatement opinionStatement;

    @NotNull
    @Valid
    @Schema(description = "Compliance with ETS rules")
    private ExternalAerEtsComplianceRules etsComplianceRules;

    @NotNull
    @Valid
    @Schema(description = "Compliance with monitoring and reporting principles")
    private ExternalAerComplianceMonitoringReporting complianceMonitoringReporting;

    @Valid
    @Schema(description = "Verify the emission reduction claim")
    private ExternalAerEmissionsReductionClaimVerification emissionsReductionClaimVerification;

    @NotNull
    @Valid
    @Schema(description = "Overall decision")
    private ExternalAerVerificationDecision overallDecision;

    @NotNull
    @Valid
    @Schema(description = "Uncorrected misstatements")
    private ExternalAerUncorrectedMisstatements uncorrectedMisstatements;

    @NotNull
    @Valid
    @Schema(description = "Uncorrected non-conformities")
    private ExternalAerUncorrectedNonConformities uncorrectedNonConformities;

    @NotNull
    @Valid
    @Schema(description = "Uncorrected non-compliances")
    private ExternalAerUncorrectedNonCompliances uncorrectedNonCompliances;

    @NotNull
    @Valid
    @Schema(description = "Recommended improvements")
    private ExternalAerRecommendedImprovements recommendedImprovements;

    @NotNull
    @Valid
    @Schema(description = "Methodologies to close data gaps")
    private ExternalAerDataGapsMethodologies dataGapsMethodologies;

    @NotNull
    @Valid
    @Schema(description = "Further information of relevance to the opinion")
    private ExternalAerInformationOfOpinionRelevance informationOfOpinionRelevance;
}

