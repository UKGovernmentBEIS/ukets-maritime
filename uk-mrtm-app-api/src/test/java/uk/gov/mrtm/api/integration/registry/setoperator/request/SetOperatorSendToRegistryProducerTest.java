package uk.gov.mrtm.api.integration.registry.setoperator.request;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.kafka.utils.KafkaConstants;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.operator.OperatorUpdateEvent;
import uk.gov.netz.integration.model.operator.OperatorUpdateEventOutcome;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SetOperatorSendToRegistryProducerTest {

    private static final String TOPIC = "maritime-set-operator-response-topic";
    private static final String EMITTER_ID = "MA04850";
    private static final String INBOUND_CORRELATION_ID = "B";
    private static final String INBOUND_PARENT_CORRELATION_ID = "O";

    @Mock
    private KafkaTemplate<String, OperatorUpdateEventOutcome> kafkaTemplate;

    private SetOperatorSendToRegistryProducer producer;

    @BeforeEach
    void setup() {
        producer = new SetOperatorSendToRegistryProducer(TOPIC);
    }

    private OperatorUpdateEventOutcome outcome() {
        return OperatorUpdateEventOutcome.builder()
                .event(OperatorUpdateEvent.builder().emitterId(EMITTER_ID).operatorId(1L).build())
                .outcome(IntegrationEventOutcome.SUCCESS)
                .errors(List.of())
                .build();
    }

    @Test
    void produce_sets_both_correlation_headers_on_outbound_record() {
        OperatorUpdateEventOutcome event = outcome();

        producer.produce(event, kafkaTemplate, INBOUND_CORRELATION_ID, INBOUND_PARENT_CORRELATION_ID);

        ProducerRecord<String, OperatorUpdateEventOutcome> sent = captureSent();
        assertThat(sent.topic()).isEqualTo(TOPIC);
        assertThat(sent.key()).isEqualTo(EMITTER_ID);
        assertThat(sent.value()).isSameAs(event);
        assertThat(headerValue(sent, KafkaConstants.CORRELATION_ID_HEADER))
                .isEqualTo(INBOUND_CORRELATION_ID);
        assertThat(headerValue(sent, KafkaConstants.CORRELATION_PARENT_ID_HEADER))
                .isEqualTo(INBOUND_PARENT_CORRELATION_ID);
    }

    @Test
    void produce_does_not_add_parent_header_when_inbound_parent_missing() {
        OperatorUpdateEventOutcome event = outcome();

        producer.produce(event, kafkaTemplate, INBOUND_CORRELATION_ID, null);

        ProducerRecord<String, OperatorUpdateEventOutcome> sent = captureSent();
        assertThat(headerValue(sent, KafkaConstants.CORRELATION_ID_HEADER))
                .isEqualTo(INBOUND_CORRELATION_ID);
        assertThat(sent.headers().lastHeader(KafkaConstants.CORRELATION_PARENT_ID_HEADER))
                .isNull();
    }

    @Test
    void produce_uses_inbound_correlation_id_so_default_interceptor_will_not_mint_uuid() {
        OperatorUpdateEventOutcome event = outcome();

        producer.produce(event, kafkaTemplate, INBOUND_CORRELATION_ID, INBOUND_PARENT_CORRELATION_ID);

        ProducerRecord<String, OperatorUpdateEventOutcome> sent = captureSent();
        assertThat(sent.headers().lastHeader(KafkaConstants.CORRELATION_ID_HEADER))
                .isNotNull();
        assertThat(headerValue(sent, KafkaConstants.CORRELATION_ID_HEADER))
                .isEqualTo(INBOUND_CORRELATION_ID);
    }

    @Test
    void produce_wraps_send_failure_in_business_exception() {
        OperatorUpdateEventOutcome event = outcome();
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenThrow(new RuntimeException("boom"));

        assertThatThrownBy(() -> producer.produce(event, kafkaTemplate,
                INBOUND_CORRELATION_ID, INBOUND_PARENT_CORRELATION_ID))
                .isInstanceOf(BusinessException.class)
                .extracting("errorCode")
                .isEqualTo(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_KAFKA_QUEUE_CONNECTION_ISSUE);
    }

    @SuppressWarnings("unchecked")
    private ProducerRecord<String, OperatorUpdateEventOutcome> captureSent() {
        ArgumentCaptor<ProducerRecord<String, OperatorUpdateEventOutcome>> captor =
                ArgumentCaptor.forClass(ProducerRecord.class);
        verify(kafkaTemplate).send(captor.capture());
        verifyNoMoreInteractions(kafkaTemplate);
        return captor.getValue();
    }

    private static String headerValue(ProducerRecord<?, ?> record, String headerName) {
        var header = record.headers().lastHeader(headerName);
        return header == null ? null : new String(header.value(), StandardCharsets.UTF_8);
    }
}
