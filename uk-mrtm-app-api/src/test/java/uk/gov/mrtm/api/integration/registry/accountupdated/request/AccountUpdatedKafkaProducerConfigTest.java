package uk.gov.mrtm.api.integration.registry.accountupdated.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.accountupdated.config.MrtmProducerAccountUpdatedConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountUpdatedKafkaProducerConfigTest {

    @InjectMocks
    private AccountUpdatedKafkaProducerConfig config;

    @Mock
    private NetzKafkaProducerFactory<String, AccountUpdatingEvent> netzKafkaProducerFactory;
    @Mock
    private MrtmProducerAccountUpdatedConfigProperties producerConfigProperties;

    @Test
    void accountUpdatedKafkaTemplate() {
        config.accountUpdatedKafkaTemplate();
        verify(netzKafkaProducerFactory).createKafkaTemplate(producerConfigProperties);
        verifyNoMoreInteractions(netzKafkaProducerFactory);
        verifyNoInteractions(producerConfigProperties);
    }
}