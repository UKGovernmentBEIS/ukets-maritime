package uk.gov.mrtm.api.integration.registry.accountupdated.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.account.AccountUpdatingEventOutcome;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountUpdatedKafkaConsumerConfigTest {

    @InjectMocks
    private AccountUpdatedKafkaConsumerConfig listener;

    @Mock
    private NetzKafkaConsumerFactory<String, AccountUpdatingEventOutcome> netzKafkaConsumerFactory;
    @Mock
    private MrtmConsumerConfigProperties consumerConfigProperties;

    @Test
    void accountAccountResponseKafkaListenerContainerFactory() {
        String groupId = "group-id";
        listener.accountAccountResponseKafkaListenerContainerFactory(groupId);
        verify(netzKafkaConsumerFactory).createKafkaListenerContainerFactory(
            groupId, consumerConfigProperties, AccountUpdatingEventOutcome.class);
        verifyNoMoreInteractions(netzKafkaConsumerFactory);
        verifyNoInteractions(consumerConfigProperties);
    }
}