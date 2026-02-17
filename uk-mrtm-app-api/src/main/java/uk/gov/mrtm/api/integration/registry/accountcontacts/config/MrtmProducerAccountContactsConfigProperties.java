package uk.gov.mrtm.api.integration.registry.accountcontacts.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerProperties;

@Validated
@ConfigurationProperties(prefix = "kafka.maritime-producer-account-contacts")
@Getter
@Setter
public class MrtmProducerAccountContactsConfigProperties extends NetzKafkaProducerProperties {
}
