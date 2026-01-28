package uk.gov.mrtm.api.integration.registry.accountupdated.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.integration.registry.accountupdated.config.MrtmProducerAccountUpdatedConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.updated.enabled", havingValue = "true")
public class AccountUpdatedKafkaProducerConfig {

    private final NetzKafkaProducerFactory<String, AccountUpdatingEvent> netzKafkaProducerFactory;
    private final MrtmProducerAccountUpdatedConfigProperties producerConfigProperties;

    @Bean
    KafkaTemplate<String, AccountUpdatingEvent> accountUpdatedKafkaTemplate() {
        return netzKafkaProducerFactory.createKafkaTemplate(producerConfigProperties);
    }
}
