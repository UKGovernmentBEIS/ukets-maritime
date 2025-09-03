package uk.gov.mrtm.api.common.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;

@Log4j2
public class JvmDnsCacheInitializer implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

  private static final String NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY = "networkaddress.cache.ttl";
  private static final String NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY_DEFAULT_VALUE_SECS = "5";
  private static final String NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY_ENV_VARIABLE = "DNS_CACHE_TTL_REFRESH_SEC";

  /**
   * Initialize the JVM DNS cache after Spring has set up logging using LoggingApplicationListener,
   * and before any DNS resolution occurs
   */
  @Override
  public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
    String envVariableJvmDnsCacheRefreshTime =  System.getenv().get(NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY_ENV_VARIABLE);
    if (envVariableJvmDnsCacheRefreshTime != null && envVariableJvmDnsCacheRefreshTime.matches("-?\\d+")) {
      log.info("Setting jvm property {} from environmental variable {} to {} secs", NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY,
          NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY_ENV_VARIABLE, envVariableJvmDnsCacheRefreshTime);
      java.security.Security.setProperty(NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY, envVariableJvmDnsCacheRefreshTime);
    } else {
      log.info("Setting jvm property {} to default value {} secs", NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY,
          NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY_DEFAULT_VALUE_SECS);
      java.security.Security.setProperty(NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY, NETWORK_ADDRESS_CACHE_TTL_JVM_PROPERTY_DEFAULT_VALUE_SECS);
    }
  }
}