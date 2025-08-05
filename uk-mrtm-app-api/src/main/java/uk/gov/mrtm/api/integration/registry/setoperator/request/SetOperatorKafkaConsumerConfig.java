package uk.gov.mrtm.api.integration.registry.setoperator.request;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.operator.OperatorUpdateEvent;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.set.operator.enabled", havingValue = "true")
public class SetOperatorKafkaConsumerConfig {

    private final NetzKafkaConsumerFactory<String, OperatorUpdateEvent> netzKafkaConsumerFactory;
    private final MrtmConsumerConfigProperties consumerConfigProperties;

    @Bean
    ConcurrentKafkaListenerContainerFactory<String, OperatorUpdateEvent> setOperatorResponseKafkaListenerContainerFactory(
            @Value("${kafka.maritime.set-operator-request.group}") String groupId) {
        return netzKafkaConsumerFactory.createKafkaListenerContainerFactory(groupId, consumerConfigProperties,
                OperatorUpdateEvent.class);
    }
}
