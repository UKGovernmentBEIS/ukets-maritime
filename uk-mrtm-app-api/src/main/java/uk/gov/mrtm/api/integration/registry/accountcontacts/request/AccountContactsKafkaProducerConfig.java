package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.integration.registry.accountcontacts.config.MrtmProducerAccountContactsConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEvent;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.contacts.enabled", havingValue = "true")
public class AccountContactsKafkaProducerConfig {

    private final NetzKafkaProducerFactory<String, MetsContactsEvent> netzKafkaProducerFactory;
    private final MrtmProducerAccountContactsConfigProperties producerConfigProperties;

    @Bean
    KafkaTemplate<String, MetsContactsEvent> accountContactsKafkaTemplate() {
        return netzKafkaProducerFactory.createKafkaTemplate(producerConfigProperties);
    }
}
