package uk.gov.mrtm.api.integration.registry.accountexempt.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.integration.registry.accountexempt.config.MrtmProducerAccountExemptConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.exemption.AccountExemptionUpdateEvent;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.exempt.enabled", havingValue = "true")
public class AccountExemptKafkaProducerConfig {

    private final NetzKafkaProducerFactory<String, AccountExemptionUpdateEvent> netzKafkaProducerFactory;
    private final MrtmProducerAccountExemptConfigProperties producerConfigProperties;

    @Bean
    KafkaTemplate<String, AccountExemptionUpdateEvent> accountExemptKafkaTemplate() {
        return netzKafkaProducerFactory.createKafkaTemplate(producerConfigProperties);
    }
}
