package uk.gov.mrtm.api.integration.registry.accountcontacts.response;

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
import uk.gov.netz.integration.model.metscontacts.MetsContactsEventOutcome;

@Log4j2
@Component
@AllArgsConstructor
@KafkaListener(topics = "${kafka.maritime.account-contacts-response.topic}",
		containerFactory = "accountContactsResponseKafkaListenerContainerFactory")
@ConditionalOnProperty(name = "registry.integration.account.contacts.enabled", havingValue = "true")
public class AccountContactsEventListener {

	private final AccountContactsResponseHandler handler;

	@Transactional
	@KafkaHandler
	public void handle(@Payload MetsContactsEventOutcome event, @Header(KafkaConstants.CORRELATION_ID_HEADER) String correlationId) {
		handler.handleResponse(event, correlationId);
	}
}