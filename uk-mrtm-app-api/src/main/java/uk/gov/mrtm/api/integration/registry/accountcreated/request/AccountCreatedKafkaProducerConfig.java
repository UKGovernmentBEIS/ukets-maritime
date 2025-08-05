package uk.gov.mrtm.api.integration.registry.accountcreated.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.integration.registry.accountcreated.config.MrtmProducerAccountCreatedConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.account.AccountOpeningEvent;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.created.enabled", havingValue = "true")
public class AccountCreatedKafkaProducerConfig {

    private final NetzKafkaProducerFactory<String, AccountOpeningEvent> netzKafkaProducerFactory;
    private final MrtmProducerAccountCreatedConfigProperties producerConfigProperties;

    @Bean
    KafkaTemplate<String, AccountOpeningEvent> accountCreatedKafkaTemplate() {
        return netzKafkaProducerFactory.createKafkaTemplate(producerConfigProperties);
    }
}
