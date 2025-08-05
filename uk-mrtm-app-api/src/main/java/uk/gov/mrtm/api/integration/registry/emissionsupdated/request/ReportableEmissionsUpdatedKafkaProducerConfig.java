package uk.gov.mrtm.api.integration.registry.emissionsupdated.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.config.MrtmProducerEmissionsUpdatedConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.emissions.updated.enabled", havingValue = "true", matchIfMissing = false)
public class ReportableEmissionsUpdatedKafkaProducerConfig {

	private final NetzKafkaProducerFactory<String, AccountEmissionsUpdateEvent> netzKafkaProducerFactory;
	private final MrtmProducerEmissionsUpdatedConfigProperties producerConfigProperties;

	@Bean
	KafkaTemplate<String, AccountEmissionsUpdateEvent> accountEmissionsUpdatedKafkaTemplate() {
		return netzKafkaProducerFactory.createKafkaTemplate(producerConfigProperties);
	}

}