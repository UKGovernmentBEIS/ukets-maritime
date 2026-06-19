package uk.gov.mrtm.api.integration.registry.setoperator.request;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.integration.model.operator.OperatorUpdateEventOutcome;

@Log4j2
@Service
@ConditionalOnProperty(name = "registry.integration.set.operator.enabled", havingValue = "true")
public class SetOperatorSendToRegistryProducer {

    private final String topicName;

    public SetOperatorSendToRegistryProducer(
            @Value("${kafka.maritime.set-operator-response.topic}") String topicName) {
        this.topicName = topicName;
    }

    @Transactional
    public void produce(OperatorUpdateEventOutcome event,
                        KafkaTemplate<String, OperatorUpdateEventOutcome> kafkaTemplate) {
        try {
            kafkaTemplate.send(topicName, String.valueOf(event.getEvent().getEmitterId()), event);
        } catch (Exception e) {
            log.error("Error when kafka producing: %s", e);
            throw new BusinessException(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_KAFKA_QUEUE_CONNECTION_ISSUE,
                    event);
        }
    }
}
