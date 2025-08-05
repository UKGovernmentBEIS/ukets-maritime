package uk.gov.mrtm.api.workflow.request.flow.common.constants;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.flow.common.constants.NotificationTemplateWorkflowTaskType;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class MrtmNotificationTemplateWorkflowTaskTypeTest {

    @Test
    void values() {
        new MrtmNotificationTemplateWorkflowTaskType();
        assertThat(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP))
            .isEqualTo("Operator Response");
        assertThat(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestType.EMP_NOTIFICATION))
            .isEqualTo("Determination");
        assertThat(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestType.AER))
            .isEqualTo("Submission");
    }
}