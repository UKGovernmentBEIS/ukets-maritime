package uk.gov.mrtm.api.integration.registry.setoperator.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.setoperator.config.MrtmProducerSetOperatorConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.operator.OperatorUpdateEventOutcome;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class SetOperatorKafkaProducerConfigTest {

    @InjectMocks
    private SetOperatorKafkaProducerConfig config;

    @Mock
    private NetzKafkaProducerFactory<String, OperatorUpdateEventOutcome> netzKafkaProducerFactory;
    @Mock
    private MrtmProducerSetOperatorConfigProperties producerConfigProperties;

    @Test
    void setOperatorKafkaTemplate() {
        config.setOperatorKafkaTemplate();
        verify(netzKafkaProducerFactory).createKafkaTemplate(producerConfigProperties);
        verifyNoMoreInteractions(netzKafkaProducerFactory);
        verifyNoInteractions(producerConfigProperties);
    }
}