package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEvent;

@Log4j2
@Service
@ConditionalOnProperty(name = "registry.integration.account.contacts.enabled", havingValue = "true")
public class AccountContactsSendToRegistryProducer {

    private final String topicName;

    public AccountContactsSendToRegistryProducer(
            @Value("${kafka.maritime.account-contacts-request.topic}") String topicName) {
        this.topicName = topicName;
    }

    @Transactional
    public void produce(MetsContactsEvent event,
                        KafkaTemplate<String, MetsContactsEvent> kafkaTemplate) {
        try {
            kafkaTemplate.send(topicName, String.valueOf(event.getOperatorId()), event);
        } catch (Exception e) {
            log.error("Error when kafka producing", e);
            throw new BusinessException(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_KAFKA_QUEUE_CONNECTION_ISSUE,
                    event);
        }
    }
}
