package uk.gov.mrtm.api.reporting.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class AerIdentifierGenerator {

    public String generate(Long accountId, int reportingYear) {
        return String.format("%s%d-%d", "MAR", accountId, reportingYear);
    }
}
