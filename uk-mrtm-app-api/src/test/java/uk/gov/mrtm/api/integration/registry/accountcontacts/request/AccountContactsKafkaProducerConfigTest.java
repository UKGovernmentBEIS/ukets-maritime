package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.accountcontacts.config.MrtmProducerAccountContactsConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEvent;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountContactsKafkaProducerConfigTest {

    @InjectMocks
    private AccountContactsKafkaProducerConfig config;

    @Mock
    private NetzKafkaProducerFactory<String, MetsContactsEvent> netzKafkaProducerFactory;
    @Mock
    private MrtmProducerAccountContactsConfigProperties producerConfigProperties;

    @Test
    void accountContactsKafkaTemplate() {
        config.accountContactsKafkaTemplate();
        verify(netzKafkaProducerFactory).createKafkaTemplate(producerConfigProperties);
        verifyNoMoreInteractions(netzKafkaProducerFactory);
        verifyNoInteractions(producerConfigProperties);
    }
}