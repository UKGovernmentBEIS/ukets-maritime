package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.DateOfNonSignificantChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotification;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationDetailsOfChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpNotificationApplicationReviewInitializerTest {

    @InjectMocks
    private EmpNotificationApplicationReviewInitializer initializer;

    @Test
    void initializePayload() {
        UUID fileUuid = UUID.randomUUID();
        String fileName = "fileName";

        final EmissionsMonitoringPlanNotification empNotification = EmissionsMonitoringPlanNotification.builder()
            .detailsOfChange(EmpNotificationDetailsOfChange.builder()
                .description("description")
                .justification("justification")
                .dateOfNonSignificantChange(
                    DateOfNonSignificantChange
                        .builder()
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusDays(1))
                        .build()
                )
                .documents(Set.of(fileUuid))
                .build())
            .build();
        final Request request = Request.builder()
            .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build())
            .payload(EmpNotificationRequestPayload.builder()
                .emissionsMonitoringPlanNotification(empNotification)
                .empNotificationAttachments(Map.of(fileUuid, fileName))
                .build())
            .build();

        EmpNotificationApplicationReviewRequestTaskPayload expected =
            EmpNotificationApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_REVIEW_PAYLOAD)
                .emissionsMonitoringPlanNotification(empNotification)
                .empNotificationAttachments(Map.of(fileUuid, fileName))
                .build();

        // Invoke
        RequestTaskPayload actual = initializer.initializePayload(request);

        // Verify
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes())
            .isEqualTo(Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_REVIEW));
    }
}
