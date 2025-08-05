package uk.gov.mrtm.api.integration.registry.emissionsupdated.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.config.MrtmProducerEmissionsUpdatedConfigProperties;
import uk.gov.netz.api.kafka.producer.NetzKafkaProducerFactory;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class ReportableEmissionsUpdatedKafkaProducerConfigTest {

    @InjectMocks
    private ReportableEmissionsUpdatedKafkaProducerConfig config;

    @Mock
    private NetzKafkaProducerFactory<String, AccountEmissionsUpdateEvent> netzKafkaProducerFactory;
    @Mock
    private MrtmProducerEmissionsUpdatedConfigProperties producerConfigProperties;

    @Test
    void accountEmissionsUpdatedKafkaTemplate() {
        config.accountEmissionsUpdatedKafkaTemplate();
        verify(netzKafkaProducerFactory).createKafkaTemplate(producerConfigProperties);
        verifyNoMoreInteractions(netzKafkaProducerFactory);
        verifyNoInteractions(producerConfigProperties);
    }
}