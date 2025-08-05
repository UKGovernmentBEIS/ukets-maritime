package uk.gov.mrtm.api.integration.registry.emissionsupdated.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEventOutcome;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class EmissionsUpdatedKafkaConsumerConfigTest {

    @InjectMocks
    private EmissionsUpdatedKafkaConsumerConfig listener;

    @Mock
    private NetzKafkaConsumerFactory<String, AccountEmissionsUpdateEventOutcome> netzKafkaConsumerFactory;
    @Mock
    private MrtmConsumerConfigProperties consumerConfigProperties;

    @Test
    void emissionsAccountResponseKafkaListenerContainerFactory() {
        String groupId = "group-id";
        listener.emissionsAccountResponseKafkaListenerContainerFactory(groupId);
        verify(netzKafkaConsumerFactory).createKafkaListenerContainerFactory(
            groupId, consumerConfigProperties, AccountEmissionsUpdateEventOutcome.class);
        verifyNoMoreInteractions(netzKafkaConsumerFactory);
        verifyNoInteractions(consumerConfigProperties);
    }
}