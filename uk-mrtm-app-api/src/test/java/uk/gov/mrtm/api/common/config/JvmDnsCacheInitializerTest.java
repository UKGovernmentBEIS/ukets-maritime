package uk.gov.mrtm.api.common.config;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import static org.assertj.core.api.Assertions.assertThat;


class JvmDnsCacheInitializerTest {

    private static final String NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY = "networkaddress.cache.ttl";
    private static final String NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY_DEFAULT_VALUE_SECS = "5";

    @Test
    void onApplicationEvent_whenEnvVarIsNotSet_setsPropertyToDefault() {
        JvmDnsCacheInitializer jvmDnsCacheInitializer = new JvmDnsCacheInitializer();
        ApplicationEnvironmentPreparedEvent event = Mockito.mock(ApplicationEnvironmentPreparedEvent.class);
        jvmDnsCacheInitializer.onApplicationEvent(event);
        assertThat(java.security.Security.getProperty(NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY)).isEqualTo(NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY_DEFAULT_VALUE_SECS);
    }

}