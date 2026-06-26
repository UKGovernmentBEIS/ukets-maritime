package uk.gov.mrtm.api.integration.common;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import uk.gov.netz.api.restlogging.RestLoggingUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class HttpCorrelationParentIdResolverTest {

    private final HttpCorrelationParentIdResolver resolver = new HttpCorrelationParentIdResolver();

    @AfterEach
    void tearDown() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    void resolves_correlation_id_from_http_response() {
        MockHttpServletResponse response = new MockHttpServletResponse();
        response.setHeader(RestLoggingUtils.CORRELATION_ID_HEADER, "http-parent");
        RequestContextHolder.setRequestAttributes(
                new ServletRequestAttributes(mock(HttpServletRequest.class), response));

        assertThat(resolver.resolveParentCorrelationId()).isEqualTo("http-parent");
    }

    @Test
    void returns_null_when_http_request_context_absent() {
        assertThat(resolver.resolveParentCorrelationId()).isNull();
    }

    @Test
    void returns_null_when_http_response_has_no_correlation_id() {
        RequestContextHolder.setRequestAttributes(
                new ServletRequestAttributes(mock(HttpServletRequest.class), new MockHttpServletResponse()));

        assertThat(resolver.resolveParentCorrelationId()).isNull();
    }
}
