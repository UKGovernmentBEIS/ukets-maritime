package uk.gov.mrtm.api.integration.registry.common;

import lombok.experimental.UtilityClass;

@UtilityClass
public class NotifyRegistryUtils {

    public static String REQUEST_LOG_FORMAT = "Registry integration: '{}' - accountId: '{}' - integration point: '{}' - data: '{}'";
    public static String RESPONSE_LOG_FORMAT = "Registry integration: '{}' - registry id '{}' - integration point: '{}' - data: '{}'";
    public static final String SERVICE_KEY = "maritime";

    public static String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
}
