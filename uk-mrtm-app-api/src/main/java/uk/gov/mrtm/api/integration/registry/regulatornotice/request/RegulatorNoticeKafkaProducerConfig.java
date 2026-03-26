package uk.gov.mrtm.api.integration.registry.regulatornotice.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.integration.registry.regulatornotice.config.MrtmProducerRegulatorNoticeConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.regulator.notice.enabled", havingValue = "true")
public class RegulatorNoticeKafkaProducerConfig {

    private final NetzKafkaProducerFactory<String, RegulatorNoticeEvent> netzKafkaProducerFactory;
    private final MrtmProducerRegulatorNoticeConfigProperties producerConfigProperties;

    @Bean
    KafkaTemplate<String, RegulatorNoticeEvent> regulatorNoticeKafkaTemplate() {
        return netzKafkaProducerFactory.createKafkaTemplate(producerConfigProperties);
    }
}
