package uk.gov.mrtm.api.integration.registry.emissionsupdated.request;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;

@Log4j2
@Service
@ConditionalOnProperty(name = "registry.integration.emissions.updated.enabled", havingValue = "true", matchIfMissing = false)
public class ReportableEmissionsSendToRegistryProducer {

    private final String topicName;

    public ReportableEmissionsSendToRegistryProducer(
            @Value("${kafka.maritime.emissions-updated-request.topic}") String topicName) {
        this.topicName = topicName;
    }

    @Transactional
    public void produce(AccountEmissionsUpdateEvent event,
                        KafkaTemplate<String, AccountEmissionsUpdateEvent> kafkaTemplate) {
        try {
        	kafkaTemplate.send(topicName, String.valueOf(event.getRegistryId()), event);
        } catch (Exception e) {
            log.error("Error when kafka producing: ", e);
            throw new BusinessException(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_KAFKA_QUEUE_CONNECTION_ISSUE,
                event);
        }
    }
}