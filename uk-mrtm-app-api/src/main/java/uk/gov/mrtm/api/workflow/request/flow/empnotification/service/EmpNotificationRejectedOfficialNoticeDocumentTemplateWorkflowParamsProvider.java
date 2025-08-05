package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateWorkflowParamsProvider;

import java.util.Map;

@Component
public class EmpNotificationRejectedOfficialNoticeDocumentTemplateWorkflowParamsProvider implements
        DocumentTemplateWorkflowParamsProvider<EmpNotificationRequestPayload> {

    @Override
    public String getContextActionType() {
        return MrtmDocumentTemplateGenerationContextActionType.EMP_NOTIFICATION_REJECTED;
    }

    @Override
    public Map<String, Object> constructParams(EmpNotificationRequestPayload payload) {
        return Map.of(
            "officialNotice",
            ((EmpNotificationReviewDecisionDetails) (payload.getReviewDecision().getDetails())).getOfficialNotice()
        );
    }
}
