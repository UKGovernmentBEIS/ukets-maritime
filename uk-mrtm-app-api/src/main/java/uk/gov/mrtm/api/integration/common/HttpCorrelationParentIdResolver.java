package uk.gov.mrtm.api.integration.common;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import uk.gov.netz.api.kafka.correlation.KafkaCorrelationParentIdResolver;
import uk.gov.netz.api.restlogging.RestLoggingUtils;

@Component
public class HttpCorrelationParentIdResolver implements KafkaCorrelationParentIdResolver {

    @Override
    public String resolveParentCorrelationId() {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes();
        if (servletRequestAttributes == null) {
            return null;
        }

        HttpServletResponse response = servletRequestAttributes.getResponse();
        return response != null ? response.getHeader(RestLoggingUtils.CORRELATION_ID_HEADER) : null;
    }
}
