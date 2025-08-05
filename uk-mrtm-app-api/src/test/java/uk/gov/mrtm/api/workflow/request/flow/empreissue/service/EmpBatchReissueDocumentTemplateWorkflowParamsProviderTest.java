package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpBatchReissueDocumentTemplateWorkflowParamsProviderTest {

    @InjectMocks
    private EmpBatchReissueDocumentTemplateWorkflowParamsProvider provider;

    @Test
    void getContextActionType() {
        assertThat(provider.getContextActionType())
                .isEqualTo(MrtmDocumentTemplateGenerationContextActionType.EMP_REISSUE);
    }


    @Test
    void constructParams() {
        String summary = "summary";

        EmpReissueRequestPayload payload = EmpReissueRequestPayload.builder()
                .summary(summary)
                .consolidationNumber(2)
                .build();

        Map<String, Object> params = provider.constructParams(payload);
        assertThat(params).hasSize(2);
        assertThat(params).containsEntry("summary", summary);
        assertThat(params).containsEntry("empConsolidationNumber", 2);
    }
}
