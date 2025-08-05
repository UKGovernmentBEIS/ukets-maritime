package uk.gov.mrtm.api.integration.registry.emissionsupdated.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerProperties;

@Validated
@ConfigurationProperties(prefix = "kafka.maritime-producer-emissions-updated")
@Getter
@Setter
public class MrtmProducerEmissionsUpdatedConfigProperties extends NetzKafkaProducerProperties {
}
