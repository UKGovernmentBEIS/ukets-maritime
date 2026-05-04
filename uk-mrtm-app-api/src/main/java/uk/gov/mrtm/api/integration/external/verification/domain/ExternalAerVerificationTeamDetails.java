package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExternalAerVerificationTeamDetails {

    @NotBlank
    @Size(min = 1, max = 500)
    @Schema(description = "Lead ETS auditor")
    private String leadEtsAuditor;

    @NotBlank
    @Size(min = 1, max = 10000)
    @Schema(description = "ETS auditors")
    private String etsAuditors;

    @NotBlank
    @Size(min = 1, max = 10000)
    @Schema(description = "Technical experts (ETS auditor)")
    private String etsTechnicalExperts;

    @NotBlank
    @Size(min = 1, max = 500)
    @Schema(description = "Independent reviewer")
    private String independentReviewer;

    @NotBlank
    @Size(min = 1, max = 10000)
    @Schema(description = "Technical experts (Independent Review)")
    private String technicalExperts;

    @NotBlank
    @Size(min = 1, max = 500)
    @Schema(description = "Name of authorised signatory")
    private String authorisedSignatoryName;
}
