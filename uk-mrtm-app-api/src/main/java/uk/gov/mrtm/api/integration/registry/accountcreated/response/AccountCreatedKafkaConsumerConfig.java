package uk.gov.mrtm.api.integration.registry.accountcreated.response;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.account.AccountOpeningEventOutcome;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.created.enabled", havingValue = "true")
public class AccountCreatedKafkaConsumerConfig {

    private final NetzKafkaConsumerFactory<String, AccountOpeningEventOutcome> netzKafkaConsumerFactory;
    private final MrtmConsumerConfigProperties consumerConfigProperties;

    @Bean
    ConcurrentKafkaListenerContainerFactory<String, AccountOpeningEventOutcome> accountCreatedResponseKafkaListenerContainerFactory(
            @Value("${kafka.maritime.account-created-response.group}") String groupId) {
        return netzKafkaConsumerFactory.createKafkaListenerContainerFactory(groupId, consumerConfigProperties,
                AccountOpeningEventOutcome.class);
    }
}
