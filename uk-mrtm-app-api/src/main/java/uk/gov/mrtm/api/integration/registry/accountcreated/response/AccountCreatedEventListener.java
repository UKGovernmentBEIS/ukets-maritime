package uk.gov.mrtm.api.integration.registry.accountcreated.response;

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
import uk.gov.netz.integration.model.account.AccountOpeningEventOutcome;

@Log4j2
@Component
@AllArgsConstructor
@KafkaListener(topics = "${kafka.maritime.account-created-response.topic}",
        containerFactory = "accountCreatedResponseKafkaListenerContainerFactory")
@ConditionalOnProperty(name = "registry.integration.account.created.enabled", havingValue = "true")
public class AccountCreatedEventListener {

    private final AccountCreatedResponseHandler handler;

    @Transactional
    @KafkaHandler
    public void handle(@Payload AccountOpeningEventOutcome event, @Header(KafkaConstants.CORRELATION_ID_HEADER) String correlationId) {
        handler.handleResponse(event, correlationId);
    }
}
