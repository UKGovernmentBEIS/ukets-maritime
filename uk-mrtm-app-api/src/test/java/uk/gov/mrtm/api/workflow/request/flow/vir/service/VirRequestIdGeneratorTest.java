package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.Year;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class VirRequestIdGeneratorTest {

    @InjectMocks
    private VirRequestIdGenerator generator;

    @Test
    void generate() {

        final RequestParams params = RequestParams.builder()
                .requestResources(Map.of(ResourceType.ACCOUNT, "12"))
            .requestMetadata(VirRequestMetadata.builder()
                .type(MrtmRequestMetadataType.VIR)
                .year(Year.of(2022))
                .build())
            .build();

        final String requestId = generator.generate(params);

        assertEquals("MAVIR00012-2022", requestId);
    }

    @Test
    void getTypes() {
        assertThat(generator.getTypes()).containsExactly(MrtmRequestType.VIR);
    }

    @Test
    void getPrefix() {

        final String prefix = generator.getPrefix();

        assertEquals("MAVIR", prefix);
    }
}
