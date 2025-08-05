package uk.gov.mrtm.api.integration.registry.setoperator.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerProperties;

@Validated
@ConfigurationProperties(prefix = "kafka.maritime-producer-set-operator")
@Getter
@Setter
public class MrtmProducerSetOperatorConfigProperties extends NetzKafkaProducerProperties {
}
