package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorReviewResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class VirReviewedDocumentTemplateWorkflowParamsProviderTest {

    @InjectMocks
    private VirReviewedDocumentTemplateWorkflowParamsProvider provider;

    @Test
    void getContextActionType() {
        assertThat(provider.getContextActionType()).isEqualTo(MrtmDocumentTemplateGenerationContextActionType.VIR_REVIEWED);
    }

    @Test
    void constructParams() {
        
        final RegulatorReviewResponse regulatorReviewResponse = RegulatorReviewResponse.builder()
                .reportSummary("Report Summary")
                .build();
        final VirRequestPayload payload = VirRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.VIR_REQUEST_PAYLOAD)
                .regulatorReviewResponse(regulatorReviewResponse)
                .build();

        assertThat(provider.constructParams(payload))
                .isEqualTo(Map.of(
                    "regulatorReviewResponse", regulatorReviewResponse
                    )
                );
    }
}
