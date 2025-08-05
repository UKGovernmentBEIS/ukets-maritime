package uk.gov.mrtm.api.reporting.domain.verification;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@SuperBuilder
public class AerVerifiedSatisfactoryDecision extends AerVerificationDecision {
}
