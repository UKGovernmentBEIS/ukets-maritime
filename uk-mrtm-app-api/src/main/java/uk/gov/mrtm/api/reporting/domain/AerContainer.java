package uk.gov.mrtm.api.reporting.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.time.Year;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#reportingRequired) == (#reportingObligationDetails == null)}", message = "aer.reportingObligation.reportingObligationDetails")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#reportingRequired) == (#aer == null)}", message = "aer.reportingObligation.reportingRequired")
public class AerContainer {

    @Valid
    private Aer aer;

    @Valid
    private AerVerificationReport verificationReport;

    @NotNull
    private Year reportingYear;

    @NotNull
    private Boolean reportingRequired;

    @Valid
    private AerReportingObligationDetails reportingObligationDetails;

    @Builder.Default
    private Map<UUID, String> aerAttachments = new HashMap<>();
}
