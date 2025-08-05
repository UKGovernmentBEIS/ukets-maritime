package uk.gov.mrtm.api.integration.registry.setoperator.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.integration.registry.setoperator.config.MrtmProducerSetOperatorConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.operator.OperatorUpdateEventOutcome;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.set.operator.enabled", havingValue = "true")
public class SetOperatorKafkaProducerConfig {

    private final NetzKafkaProducerFactory<String, OperatorUpdateEventOutcome> netzKafkaProducerFactory;
    private final MrtmProducerSetOperatorConfigProperties producerConfigProperties;

    @Bean
    KafkaTemplate<String, OperatorUpdateEventOutcome> setOperatorKafkaTemplate() {
        return netzKafkaProducerFactory.createKafkaTemplate(producerConfigProperties);
    }
}
