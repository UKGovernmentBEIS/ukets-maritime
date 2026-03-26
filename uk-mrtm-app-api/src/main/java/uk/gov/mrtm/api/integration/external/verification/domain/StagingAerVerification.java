package uk.gov.mrtm.api.integration.external.verification.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderPayload;
import uk.gov.mrtm.api.reporting.domain.verification.AerComplianceMonitoringReporting;
import uk.gov.mrtm.api.reporting.domain.verification.AerDataGapsMethodologies;
import uk.gov.mrtm.api.reporting.domain.verification.AerEmissionsReductionClaimVerification;
import uk.gov.mrtm.api.reporting.domain.verification.AerEtsComplianceRules;
import uk.gov.mrtm.api.reporting.domain.verification.AerMaterialityLevel;
import uk.gov.mrtm.api.reporting.domain.verification.AerOpinionStatement;
import uk.gov.mrtm.api.reporting.domain.verification.AerRecommendedImprovements;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedMisstatements;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedNonCompliances;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedNonConformities;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationDecision;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationTeamDetails;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifierContact;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StagingAerVerification extends ThirdPartyDataProviderPayload {

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

    @Valid
    private AerEmissionsReductionClaimVerification emissionsReductionClaimVerification;

    @NotNull
    @Valid
    private AerMaterialityLevel materialityLevel;

    @NotNull
    @Valid
    private AerEtsComplianceRules etsComplianceRules;

    @NotNull
    @Valid
    private AerComplianceMonitoringReporting complianceMonitoringReporting;

    @NotNull
    @Valid
    private AerDataGapsMethodologies dataGapsMethodologies;

}