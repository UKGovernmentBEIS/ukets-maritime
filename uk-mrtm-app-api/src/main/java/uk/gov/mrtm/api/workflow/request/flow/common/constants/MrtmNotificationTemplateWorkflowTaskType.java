package uk.gov.mrtm.api.workflow.request.flow.common.constants;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.flow.common.constants.NotificationTemplateWorkflowTaskType;

/**
 * This class is defined as a bean solely to ensure the static block is executed.
 * It is neither intended to be injected nor used as a static service.
 */
@Component
public class MrtmNotificationTemplateWorkflowTaskType {

    static {
        NotificationTemplateWorkflowTaskType.add(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP, "Operator Response");
        NotificationTemplateWorkflowTaskType.add(MrtmRequestType.EMP_NOTIFICATION, "Determination");
        NotificationTemplateWorkflowTaskType.add(MrtmRequestType.AER, "Submission");
        NotificationTemplateWorkflowTaskType.add(MrtmRequestType.VIR, "Submission");
        NotificationTemplateWorkflowTaskType.add(MrtmRequestType.EMP_ISSUANCE, "EMP determination");
        NotificationTemplateWorkflowTaskType.add(MrtmRequestType.EMP_VARIATION, "EMP variation determination");
        NotificationTemplateWorkflowTaskType.add(MrtmRequestTaskType.VIR_RESPOND_TO_REGULATOR_COMMENTS, "Follow up Action");
    }
}
