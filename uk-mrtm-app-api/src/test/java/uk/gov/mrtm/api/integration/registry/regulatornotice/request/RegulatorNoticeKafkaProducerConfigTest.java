package uk.gov.mrtm.api.integration.registry.regulatornotice.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.regulatornotice.config.MrtmProducerRegulatorNoticeConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class RegulatorNoticeKafkaProducerConfigTest {

    @InjectMocks
    private RegulatorNoticeKafkaProducerConfig config;

    @Mock
    private NetzKafkaProducerFactory<String, RegulatorNoticeEvent> netzKafkaProducerFactory;
    @Mock
    private MrtmProducerRegulatorNoticeConfigProperties producerConfigProperties;

    @Test
    void regulatorNoticeKafkaTemplate() {
        config.regulatorNoticeKafkaTemplate();
        verify(netzKafkaProducerFactory).createKafkaTemplate(producerConfigProperties);
        verifyNoMoreInteractions(netzKafkaProducerFactory);
        verifyNoInteractions(producerConfigProperties);
    }
}