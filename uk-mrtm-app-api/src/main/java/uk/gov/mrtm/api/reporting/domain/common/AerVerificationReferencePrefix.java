package uk.gov.mrtm.api.reporting.domain.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AerVerificationReferencePrefix {
    UNCORRECTED_MISSTATEMENTS("A"),
    UNCORRECTED_NON_CONFORMITIES("B"),
    UNCORRECTED_NON_COMPLIANCES("C"),
    RECOMMENDED_IMPROVEMENTS("D"),
    PRIOR_YEAR_ISSUES("E");

    private final String prefix;
}
