package uk.gov.mrtm.api.integration.registry.emissionsupdated.response;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEventOutcome;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.emissions.updated.enabled", havingValue = "true", matchIfMissing = false)
public class EmissionsUpdatedKafkaConsumerConfig {
	
	private final NetzKafkaConsumerFactory<String, AccountEmissionsUpdateEventOutcome> netzKafkaConsumerFactory;
	private final MrtmConsumerConfigProperties consumerConfigProperties;

	@Bean
	ConcurrentKafkaListenerContainerFactory<String, AccountEmissionsUpdateEventOutcome> emissionsAccountResponseKafkaListenerContainerFactory(
			@Value("${kafka.maritime.emissions-updated-response.group}") String groupId) {
		return netzKafkaConsumerFactory.createKafkaListenerContainerFactory(groupId, consumerConfigProperties,
			AccountEmissionsUpdateEventOutcome.class);
	}
}