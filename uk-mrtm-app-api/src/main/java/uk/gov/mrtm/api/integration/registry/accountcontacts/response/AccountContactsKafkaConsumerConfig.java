package uk.gov.mrtm.api.integration.registry.accountcontacts.response;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEventOutcome;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.contacts.enabled", havingValue = "true")
public class AccountContactsKafkaConsumerConfig {
	
	private final NetzKafkaConsumerFactory<String, MetsContactsEventOutcome> netzKafkaConsumerFactory;
	private final MrtmConsumerConfigProperties consumerConfigProperties;

	@Bean
	ConcurrentKafkaListenerContainerFactory<String, MetsContactsEventOutcome> accountContactsResponseKafkaListenerContainerFactory(
			@Value("${kafka.maritime.account-contacts-response.group}") String groupId) {
		return netzKafkaConsumerFactory.createKafkaListenerContainerFactory(groupId, consumerConfigProperties,
			MetsContactsEventOutcome.class);
	}
}