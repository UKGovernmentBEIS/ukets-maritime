package uk.gov.mrtm.api.integration.registry.accountupdated.request;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;

@Log4j2
@Service
@ConditionalOnProperty(name = "registry.integration.account.updated.enabled", havingValue = "true")
public class AccountUpdatedSendToRegistryProducer {

    private final String topicName;

    public AccountUpdatedSendToRegistryProducer(
        @Value("${kafka.maritime.account-updated-request.topic}") String topicName) {
        this.topicName = topicName;
    }

    @Transactional
    public void produce(AccountUpdatingEvent event,
                        KafkaTemplate<String, AccountUpdatingEvent> kafkaTemplate) {
        try {
            kafkaTemplate.send(topicName, String.valueOf(event.getAccountDetails().getRegistryId()), event);
        } catch (Exception e) {
            log.error("Error when kafka producing: {}", e.getMessage());
            throw new BusinessException(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_KAFKA_QUEUE_CONNECTION_ISSUE,
                    event);
        }
    }

}
