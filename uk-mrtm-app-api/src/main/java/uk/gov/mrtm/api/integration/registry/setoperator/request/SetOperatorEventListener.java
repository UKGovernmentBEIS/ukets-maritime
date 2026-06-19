package uk.gov.mrtm.api.integration.registry.setoperator.request;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.netz.api.kafka.utils.KafkaConstants;
import uk.gov.netz.integration.model.operator.OperatorUpdateEvent;

@Log4j2
@Component
@AllArgsConstructor
@KafkaListener(topics = "${kafka.maritime.set-operator-request.topic}",
        containerFactory = "setOperatorResponseKafkaListenerContainerFactory")
@ConditionalOnProperty(name = "registry.integration.set.operator.enabled", havingValue = "true")
public class SetOperatorEventListener {

    private final SetOperatorResponseHandler handler;

    @Transactional
    @KafkaHandler
    public void handle(@Payload OperatorUpdateEvent event, @Header(KafkaConstants.CORRELATION_ID_HEADER) String correlationId) {
        handler.handleResponse(event, correlationId);
    }
}
