package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceRequestIdGeneratorTest {

    @InjectMocks
    private EmpIssuanceRequestIdGenerator requestIdGenerator;

    @Test
    void generate() {
        RequestParams params = RequestParams.builder().requestResources(Map.of(ResourceType.ACCOUNT, "1345")).build();

        String requestId = requestIdGenerator.generate(params);

        assertThat(requestId).isEqualTo("MAMP01345");
    }

    @Test
    void getTypes() {
        assertThat(requestIdGenerator.getTypes()).containsExactly(MrtmRequestType.EMP_ISSUANCE);
    }

    @Test
    void getPrefix() {
        assertEquals("MAMP", requestIdGenerator.getPrefix());
    }


}
