package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.Year;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerRequestIdGeneratorTest {
    @InjectMocks
    private AerRequestIdGenerator generator;

    @Test
    void generate() {
        RequestParams params = RequestParams.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, "12"))
            .requestMetadata(AerRequestMetadata.builder()
                .type(MrtmRequestMetadataType.AER)
                .year(Year.of(2025))
                .build())
            .build();

        String requestId = generator.generate(params);

        assertEquals("MAR00012-2025", requestId);
    }

    @Test
    void getTypes() {
        assertThat(generator.getTypes()).containsExactly(MrtmRequestType.AER);
    }

    @Test
    void getPrefix() {
        String prefix = generator.getPrefix();

        assertEquals("MAR", prefix);
    }
}
