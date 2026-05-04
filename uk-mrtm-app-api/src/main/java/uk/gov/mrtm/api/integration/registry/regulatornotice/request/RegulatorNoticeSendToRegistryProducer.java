package uk.gov.mrtm.api.integration.registry.regulatornotice.request;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;

@Log4j2
@Service
@ConditionalOnProperty(name = "registry.integration.regulator.notice.enabled", havingValue = "true")
public class RegulatorNoticeSendToRegistryProducer {

    private final String topicName;

    public RegulatorNoticeSendToRegistryProducer(
        @Value("${kafka.maritime.regulator-notice-request.topic}") String topicName) {
        this.topicName = topicName;
    }

    @Transactional
    public void produce(RegulatorNoticeEvent event,
                        KafkaTemplate<String, RegulatorNoticeEvent> kafkaTemplate) {
        try {
            kafkaTemplate.send(topicName, String.valueOf(event.getRegistryId()), event);
        } catch (Exception e) {
            log.error("Error when kafka producing", e);
            throw new BusinessException(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_KAFKA_QUEUE_CONNECTION_ISSUE,
                    event);
        }
    }
}
