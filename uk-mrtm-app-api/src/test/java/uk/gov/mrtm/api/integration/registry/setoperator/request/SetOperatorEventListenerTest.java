package uk.gov.mrtm.api.integration.registry.setoperator.request;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.api.kafka.correlation.KafkaCorrelationContextHolder;
import uk.gov.netz.integration.model.operator.OperatorUpdateEvent;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class SetOperatorEventListenerTest {

    private static final String INBOUND_CORRELATION_ID = "B";
    private static final String INBOUND_PARENT_CORRELATION_ID = "O";

    @InjectMocks
    private SetOperatorEventListener listener;

    @Mock
    private SetOperatorResponseHandler handler;

    @AfterEach
    void tearDown() {
        KafkaCorrelationContextHolder.clear();
    }

    @Test
    void handle_forwards_both_correlation_headers() {
        OperatorUpdateEvent event = mock(OperatorUpdateEvent.class);

        listener.handle(event, INBOUND_CORRELATION_ID, INBOUND_PARENT_CORRELATION_ID);

        verify(handler).handleResponse(event, INBOUND_CORRELATION_ID, INBOUND_PARENT_CORRELATION_ID);
        verifyNoMoreInteractions(handler);
    }

    @Test
    void handle_forwards_null_parent_when_inbound_parent_missing() {
        OperatorUpdateEvent event = mock(OperatorUpdateEvent.class);

        listener.handle(event, INBOUND_CORRELATION_ID, null);

        verify(handler).handleResponse(event, INBOUND_CORRELATION_ID, null);
        verifyNoMoreInteractions(handler);
    }

    @Test
    void handle_seeds_kafka_correlation_context_with_inbound_parent_and_a_sibling_uuid() {
        OperatorUpdateEvent event = mock(OperatorUpdateEvent.class);
        AtomicReference<String> capturedParent = new AtomicReference<>();
        AtomicReference<String> capturedSibling = new AtomicReference<>();

        doAnswer(invocation -> {
            capturedParent.set(KafkaCorrelationContextHolder.getParentCorrelationId());
            capturedSibling.set(KafkaCorrelationContextHolder.getCorrelationId());
            return null;
        }).when(handler).handleResponse(any(), any(), any());

        listener.handle(event, INBOUND_CORRELATION_ID, INBOUND_PARENT_CORRELATION_ID);

        assertThat(capturedParent.get()).isEqualTo(INBOUND_PARENT_CORRELATION_ID);
        assertThat(capturedSibling.get()).isNotNull();
        // Sibling must be a valid UUID.
        assertThat(UUID.fromString(capturedSibling.get())).isNotNull();
    }

    @Test
    void handle_seeds_only_sibling_when_inbound_parent_missing() {
        OperatorUpdateEvent event = mock(OperatorUpdateEvent.class);
        AtomicReference<String> capturedParent = new AtomicReference<>();
        AtomicReference<String> capturedSibling = new AtomicReference<>();

        doAnswer(invocation -> {
            capturedParent.set(KafkaCorrelationContextHolder.getParentCorrelationId());
            capturedSibling.set(KafkaCorrelationContextHolder.getCorrelationId());
            return null;
        }).when(handler).handleResponse(any(), any(), any());

        listener.handle(event, INBOUND_CORRELATION_ID, null);

        assertThat(capturedParent.get()).isNull();
        assertThat(capturedSibling.get()).isNotNull();
    }

    @Test
    void handle_clears_context_after_successful_return() {
        OperatorUpdateEvent event = mock(OperatorUpdateEvent.class);

        listener.handle(event, INBOUND_CORRELATION_ID, INBOUND_PARENT_CORRELATION_ID);

        assertThat(KafkaCorrelationContextHolder.getParentCorrelationId()).isNull();
        assertThat(KafkaCorrelationContextHolder.getCorrelationId()).isNull();
    }

    @Test
    void handle_clears_context_even_when_handler_throws() {
        OperatorUpdateEvent event = mock(OperatorUpdateEvent.class);
        doThrow(new RuntimeException("boom"))
                .when(handler).handleResponse(any(), any(), any());

        assertThatThrownBy(() -> listener.handle(event, INBOUND_CORRELATION_ID, INBOUND_PARENT_CORRELATION_ID))
                .isInstanceOf(RuntimeException.class);

        assertThat(KafkaCorrelationContextHolder.getParentCorrelationId()).isNull();
        assertThat(KafkaCorrelationContextHolder.getCorrelationId()).isNull();
    }
}
