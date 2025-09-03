package uk.gov.mrtm.api.integration.common;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import uk.gov.netz.api.kafka.producer.KafkaCorrelationParentHeaderProducerInterceptor;
import uk.gov.netz.api.kafka.utils.KafkaConstants;
import uk.gov.netz.api.restlogging.RestLoggingUtils;

import java.util.Map;


@Log4j2
@Component
public class KafkaCorrelationParentHeaderProducerMrtmInterceptor<K, V>
        implements KafkaCorrelationParentHeaderProducerInterceptor<K, V> {

    @Override
    public ProducerRecord<K, V> onSend(ProducerRecord<K, V> producerRecord) {
        if (producerRecord.headers().lastHeader(KafkaConstants.CORRELATION_PARENT_ID_HEADER) == null) {
            ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (servletRequestAttributes != null) {
                HttpServletResponse response = servletRequestAttributes.getResponse();
                if (response != null) {
                    producerRecord.headers().add(KafkaConstants.CORRELATION_PARENT_ID_HEADER,
                            response.getHeader(RestLoggingUtils.CORRELATION_ID_HEADER).getBytes());
                }
            }
        }

        return producerRecord;
    }

    @Override
    public void onAcknowledgement(RecordMetadata metadata, Exception exception) {
        // No-op: No post-send acknowledgement handling required for this interceptor
    }

    @Override
    public void close() {
        // No-op: No resources to close for this interceptor
    }

    @Override
    public void configure(Map<String, ?> configs) {
        // No-op: No specific configuration required for this interceptor
    }
}