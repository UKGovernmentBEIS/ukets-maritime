package uk.gov.mrtm.api.integration.registry.accountupdated.response;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.account.AccountUpdatingEventOutcome;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.updated.enabled", havingValue = "true")
public class AccountUpdatedKafkaConsumerConfig {
	
	private final NetzKafkaConsumerFactory<String, AccountUpdatingEventOutcome> netzKafkaConsumerFactory;
	private final MrtmConsumerConfigProperties consumerConfigProperties;

	@Bean
	ConcurrentKafkaListenerContainerFactory<String, AccountUpdatingEventOutcome> accountAccountResponseKafkaListenerContainerFactory(
			@Value("${kafka.maritime.account-updated-response.group}") String groupId) {
		return netzKafkaConsumerFactory.createKafkaListenerContainerFactory(groupId, consumerConfigProperties,
			AccountUpdatingEventOutcome.class);
	}
}