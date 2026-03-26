package uk.gov.mrtm.api.integration.registry.accountcontacts.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEventOutcome;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountContactsKafkaConsumerConfigTest {

    @InjectMocks
    private AccountContactsKafkaConsumerConfig listener;

    @Mock
    private NetzKafkaConsumerFactory<String, MetsContactsEventOutcome> netzKafkaConsumerFactory;
    @Mock
    private MrtmConsumerConfigProperties consumerConfigProperties;

    @Test
    void accountContactsResponseKafkaListenerContainerFactory() {
        String groupId = "group-id";
        listener.accountContactsResponseKafkaListenerContainerFactory(groupId);
        verify(netzKafkaConsumerFactory).createKafkaListenerContainerFactory(
            groupId, consumerConfigProperties, MetsContactsEventOutcome.class);
        verifyNoMoreInteractions(netzKafkaConsumerFactory);
        verifyNoInteractions(consumerConfigProperties);
    }
}