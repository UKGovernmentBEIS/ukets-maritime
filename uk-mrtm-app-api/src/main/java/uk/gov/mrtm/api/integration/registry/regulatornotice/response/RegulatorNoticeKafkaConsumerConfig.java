package uk.gov.mrtm.api.integration.registry.regulatornotice.response;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEventOutcome;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.regulator.notice.enabled", havingValue = "true")
public class RegulatorNoticeKafkaConsumerConfig {
	
	private final NetzKafkaConsumerFactory<String, RegulatorNoticeEventOutcome> netzKafkaConsumerFactory;
	private final MrtmConsumerConfigProperties consumerConfigProperties;

	@Bean
	ConcurrentKafkaListenerContainerFactory<String, RegulatorNoticeEventOutcome> regulatorNoticeResponseKafkaListenerContainerFactory(
			@Value("${kafka.maritime.regulator-notice-response.group}") String groupId) {
		return netzKafkaConsumerFactory.createKafkaListenerContainerFactory(groupId, consumerConfigProperties,
			RegulatorNoticeEventOutcome.class);
	}
}