package uk.gov.mrtm.api.integration.registry.accountcreated.request;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.integration.model.account.AccountOpeningEvent;

@Log4j2
@Service
@ConditionalOnProperty(name = "registry.integration.account.created.enabled", havingValue = "true")
public class AccountCreatedSendToRegistryProducer {

    private final String topicName;

    public AccountCreatedSendToRegistryProducer(
            @Value("${kafka.maritime.account-created-request.topic}") String topicName) {
        this.topicName = topicName;
    }

    @Transactional
    public void produce(AccountOpeningEvent event,
                        KafkaTemplate<String, AccountOpeningEvent> kafkaTemplate) {
        try {
            kafkaTemplate.send(topicName, String.valueOf(event.getAccountDetails().getEmitterId()), event);
        } catch (Exception e) {
            log.error("Error when kafka producing: {}", e.getMessage());
            throw new BusinessException(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_KAFKA_QUEUE_CONNECTION_ISSUE,
                    event);
        }
    }
}
