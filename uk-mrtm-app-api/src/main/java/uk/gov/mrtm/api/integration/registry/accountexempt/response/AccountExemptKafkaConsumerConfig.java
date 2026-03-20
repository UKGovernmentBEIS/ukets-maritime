package uk.gov.mrtm.api.integration.registry.accountexempt.response;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.exemption.AccountExemptionUpdateEventOutcome;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.exempt.enabled", havingValue = "true")
public class AccountExemptKafkaConsumerConfig {
	
	private final NetzKafkaConsumerFactory<String, AccountExemptionUpdateEventOutcome> netzKafkaConsumerFactory;
	private final MrtmConsumerConfigProperties consumerConfigProperties;

	@Bean
	ConcurrentKafkaListenerContainerFactory<String, AccountExemptionUpdateEventOutcome> accountExemptResponseKafkaListenerContainerFactory(
			@Value("${kafka.maritime.account-exempt-response.group}") String groupId) {
		return netzKafkaConsumerFactory.createKafkaListenerContainerFactory(groupId, consumerConfigProperties,
			AccountExemptionUpdateEventOutcome.class);
	}
}