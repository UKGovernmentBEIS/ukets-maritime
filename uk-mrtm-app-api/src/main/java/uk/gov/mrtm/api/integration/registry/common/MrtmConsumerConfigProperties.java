package uk.gov.mrtm.api.integration.registry.common;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerProperties;

@Validated
@ConfigurationProperties(prefix = "kafka.maritime-consumer")
@Getter
@Setter
public class MrtmConsumerConfigProperties extends NetzKafkaConsumerProperties {
}
