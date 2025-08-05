package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;


@ExtendWith(MockitoExtension.class)
class EmpNotificationGrantedOfficialNoticeDocumentTemplateWorkflowParamsProviderTest {

    @InjectMocks
    private EmpNotificationGrantedOfficialNoticeDocumentTemplateWorkflowParamsProvider provider;

    @Test
    void getContextActionType() {
        assertThat(provider.getContextActionType())
            .isEqualTo(MrtmDocumentTemplateGenerationContextActionType.EMP_NOTIFICATION_GRANTED);
    }


    @Test
    void constructParams() {
        String officialNotice = "test";

        EmpNotificationRequestPayload payload = EmpNotificationRequestPayload.builder()
            .reviewDecision(EmpNotificationReviewDecision.builder().details(
                EmpNotificationAcceptedDecisionDetails
                    .builder()
                    .officialNotice(officialNotice)
                    .build())
                .build())
            .build();

        Map<String, Object> params = provider.constructParams(payload);
        assertThat(params.size()).isEqualTo(1);
        assertThat(params).containsEntry("officialNotice", officialNotice);
    }
}