package uk.gov.mrtm.api.account.service;

import lombok.experimental.UtilityClass;

@UtilityClass
public class AccountBusinessIdGenerator {

    public static String generate(Long accountId) {
        return String.format("%s%s", "MA", String.format("%05d", accountId));
    }
}
