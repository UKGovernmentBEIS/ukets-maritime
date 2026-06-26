package uk.gov.mrtm.api.integration.registry.setoperator.request;

import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.kafka.utils.KafkaConstants;
import uk.gov.netz.integration.model.operator.OperatorUpdateEventOutcome;

import java.nio.charset.StandardCharsets;

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
                        KafkaTemplate<String, OperatorUpdateEventOutcome> kafkaTemplate,
                        String correlationId,
                        String parentCorrelationId) {
        try {
            String key = String.valueOf(event.getEvent().getEmitterId());
            ProducerRecord<String, OperatorUpdateEventOutcome> producerRecord =
                    new ProducerRecord<>(topicName, null, key, event);

            if (correlationId != null) {
                producerRecord.headers().add(
                        KafkaConstants.CORRELATION_ID_HEADER,
                        correlationId.getBytes(StandardCharsets.UTF_8));
            }
            if (parentCorrelationId != null) {
                producerRecord.headers().add(
                        KafkaConstants.CORRELATION_PARENT_ID_HEADER,
                        parentCorrelationId.getBytes(StandardCharsets.UTF_8));
            }

            kafkaTemplate.send(producerRecord);
        } catch (Exception e) {
            log.error("Error when kafka producing", e);
            throw new BusinessException(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_KAFKA_QUEUE_CONNECTION_ISSUE,
                    event);
        }
    }
}
