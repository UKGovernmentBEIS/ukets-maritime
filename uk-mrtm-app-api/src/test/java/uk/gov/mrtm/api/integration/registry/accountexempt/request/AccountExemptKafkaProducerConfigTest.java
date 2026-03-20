package uk.gov.mrtm.api.integration.registry.accountexempt.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.accountexempt.config.MrtmProducerAccountExemptConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.exemption.AccountExemptionUpdateEvent;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountExemptKafkaProducerConfigTest {

    @InjectMocks
    private AccountExemptKafkaProducerConfig config;

    @Mock
    private NetzKafkaProducerFactory<String, AccountExemptionUpdateEvent> netzKafkaProducerFactory;
    @Mock
    private MrtmProducerAccountExemptConfigProperties producerConfigProperties;

    @Test
    void accountExemptKafkaTemplate() {
        config.accountExemptKafkaTemplate();
        verify(netzKafkaProducerFactory).createKafkaTemplate(producerConfigProperties);
        verifyNoMoreInteractions(netzKafkaProducerFactory);
        verifyNoInteractions(producerConfigProperties);
    }
}