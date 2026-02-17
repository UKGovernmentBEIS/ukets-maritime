package uk.gov.mrtm.api.integration.registry.accountexempt.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.exemption.AccountExemptionUpdateEventOutcome;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountExemptKafkaConsumerConfigTest {

    @InjectMocks
    private AccountExemptKafkaConsumerConfig listener;

    @Mock
    private NetzKafkaConsumerFactory<String, AccountExemptionUpdateEventOutcome> netzKafkaConsumerFactory;
    @Mock
    private MrtmConsumerConfigProperties consumerConfigProperties;

    @Test
    void accountExemptResponseKafkaListenerContainerFactory() {
        String groupId = "group-id";
        listener.accountExemptResponseKafkaListenerContainerFactory(groupId);
        verify(netzKafkaConsumerFactory).createKafkaListenerContainerFactory(
            groupId, consumerConfigProperties, AccountExemptionUpdateEventOutcome.class);
        verifyNoMoreInteractions(netzKafkaConsumerFactory);
        verifyNoInteractions(consumerConfigProperties);
    }
}