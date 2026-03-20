package uk.gov.mrtm.api.integration.registry.regulatornotice.response;

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
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEventOutcome;

@Log4j2
@Component
@AllArgsConstructor
@KafkaListener(topics = "${kafka.maritime.regulator-notice-response.topic}",
		containerFactory = "regulatorNoticeResponseKafkaListenerContainerFactory")
@ConditionalOnProperty(name = "registry.integration.regulator.notice.enabled", havingValue = "true")
public class RegulatorNoticeEventListener {

	private final RegulatorNoticeResponseHandler handler;

	@Transactional
	@KafkaHandler
	public void handle(@Payload RegulatorNoticeEventOutcome event, @Header(KafkaConstants.CORRELATION_ID_HEADER) String correlationId) {
		handler.handleResponse(event, correlationId);
	}
}