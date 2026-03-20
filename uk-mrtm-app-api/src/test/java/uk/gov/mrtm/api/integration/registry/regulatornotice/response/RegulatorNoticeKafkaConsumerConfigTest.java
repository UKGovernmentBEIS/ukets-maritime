package uk.gov.mrtm.api.integration.registry.regulatornotice.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.common.MrtmConsumerConfigProperties;
import uk.gov.netz.api.kafka.consumer.NetzKafkaConsumerFactory;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEventOutcome;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class RegulatorNoticeKafkaConsumerConfigTest {

    @InjectMocks
    private RegulatorNoticeKafkaConsumerConfig listener;

    @Mock
    private NetzKafkaConsumerFactory<String, RegulatorNoticeEventOutcome> netzKafkaConsumerFactory;
    @Mock
    private MrtmConsumerConfigProperties consumerConfigProperties;

    @Test
    void regulatorNoticeResponseKafkaListenerContainerFactory() {
        String groupId = "group-id";
        listener.regulatorNoticeResponseKafkaListenerContainerFactory(groupId);
        verify(netzKafkaConsumerFactory).createKafkaListenerContainerFactory(
            groupId, consumerConfigProperties, RegulatorNoticeEventOutcome.class);
        verifyNoMoreInteractions(netzKafkaConsumerFactory);
        verifyNoInteractions(consumerConfigProperties);
    }
}