package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.DateOfNonSignificantChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotification;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotificationContainer;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSaveRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationDetailsOfChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RequestEmpNotificationServiceTest {

    @InjectMocks
    private RequestEmpNotificationService service;

    @Mock
    private RequestService requestService;

    @Mock
    private EmpNotificationApplicationSubmitValidatorService empNotificationApplicationSubmitValidatorService;

    @Test
    void applySavePayload_existing_task_payload() {
        EmpNotificationApplicationSubmitRequestTaskPayload taskPayload =
                EmpNotificationApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_SUBMIT_PAYLOAD)
                .emissionsMonitoringPlanNotification(
                        EmissionsMonitoringPlanNotification.builder()
                                .detailsOfChange(EmpNotificationDetailsOfChange.builder()
                                        .description("description")
                                        .justification("justification")
                                        .dateOfNonSignificantChange(DateOfNonSignificantChange.builder()
                                                .startDate(LocalDate.now())
                                                .endDate(LocalDate.now().plusDays(1))
                                                .build())
                                        .build())
                                .build())
                .sectionsCompleted(Map.of("SECTION_1", "accepted"))
                .build();

        EmpNotificationApplicationSaveRequestTaskActionPayload actionPayload =
                EmpNotificationApplicationSaveRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_SAVE_APPLICATION_PAYLOAD)
                .emissionsMonitoringPlanNotification(
                        EmissionsMonitoringPlanNotification.builder()
                                .detailsOfChange(EmpNotificationDetailsOfChange.builder()
                                        .description("description")
                                        .justification("justification")
                                        .dateOfNonSignificantChange(DateOfNonSignificantChange.builder()
                                                .startDate(LocalDate.now())
                                                .endDate(LocalDate.now().plusDays(1))
                                                .build())
                                        .build())
                                .build()
                )
                .sectionsCompleted(Map.of())
                .build();

        RequestTask requestTask = RequestTask.builder().id(1L)
                .payload(taskPayload)
                .type(RequestTaskType.builder().code(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_SUBMIT).build())
                .build();

        // Invoke
        service.applySavePayload(actionPayload, requestTask);

        // Verify
        assertThat(taskPayload.getEmissionsMonitoringPlanNotification())
                .isEqualTo(actionPayload.getEmissionsMonitoringPlanNotification());
        assertThat(taskPayload.getSectionsCompleted()).isEmpty();
    }

    @Test
    void applySavePayload_new_task_payload() {
        EmpNotificationApplicationSaveRequestTaskActionPayload actionPayload =
                EmpNotificationApplicationSaveRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_SAVE_APPLICATION_PAYLOAD)
                .emissionsMonitoringPlanNotification(
                        EmissionsMonitoringPlanNotification.builder()
                                .detailsOfChange(EmpNotificationDetailsOfChange.builder()
                                        .description("description")
                                        .justification("justification")
                                        .dateOfNonSignificantChange(DateOfNonSignificantChange.builder()
                                                .startDate(LocalDate.now())
                                                .endDate(LocalDate.now().plusDays(1))
                                                .build())
                                        .build())
                                .build()
                )
                .sectionsCompleted(Map.of("SECTION_1", "accepted"))
                .build();

        RequestTask requestTask = RequestTask.builder().id(1L)
                .type(RequestTaskType.builder().code(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_SUBMIT).build())
                .build();

        service.applySavePayload(actionPayload, requestTask);

        EmpNotificationApplicationSubmitRequestTaskPayload savedTaskPayload =
            (EmpNotificationApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        assertThat(savedTaskPayload.getEmissionsMonitoringPlanNotification())
                .isEqualTo(actionPayload.getEmissionsMonitoringPlanNotification());
        assertThat(savedTaskPayload.getSectionsCompleted()).isEqualTo(actionPayload.getSectionsCompleted());
    }

    @Test
    void applySubmitPayload() {
        AppUser authUser = AppUser.builder().userId("user").build();

        EmpNotificationRequestPayload requestPayload = EmpNotificationRequestPayload.builder()
            .payloadType(MrtmRequestPayloadType.EMP_NOTIFICATION_REQUEST_PAYLOAD).build();
        Request request =
            Request.builder().id("1").payload(requestPayload)
                    .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build()).build();
        EmissionsMonitoringPlanNotification empNotification = EmissionsMonitoringPlanNotification.builder()
                .detailsOfChange(EmpNotificationDetailsOfChange.builder()
                        .description("description")
                        .justification("justification")
                        .dateOfNonSignificantChange(DateOfNonSignificantChange.builder()
                                .startDate(LocalDate.now())
                                .endDate(LocalDate.now().plusDays(1))
                                .build())
                        .build())
                .build();

        EmpNotificationApplicationSubmitRequestTaskPayload taskPayload =
                EmpNotificationApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_SUBMIT_PAYLOAD)
                .emissionsMonitoringPlanNotification(
                        EmissionsMonitoringPlanNotification.builder()
                                .detailsOfChange(EmpNotificationDetailsOfChange.builder()
                                        .description("description")
                                        .justification("justification")
                                        .dateOfNonSignificantChange(DateOfNonSignificantChange.builder()
                                                .startDate(LocalDate.now())
                                                .endDate(LocalDate.now().plusDays(1))
                                                .build())
                                        .build())
                                .build()
                )
                .sectionsCompleted(Map.of("SECTION_1", "accepted"))
                .build();
        RequestTask requestTask = RequestTask.builder().id(1L)
            .payload(taskPayload)
            .type(RequestTaskType.builder().code(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_SUBMIT).build())
            .request(request)
            .build();
        RequestActionPayload actionPayload = EmpNotificationApplicationSubmittedRequestActionPayload.builder()
            .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_SUBMITTED_PAYLOAD)
            .emissionsMonitoringPlanNotification(empNotification)
            .sectionsCompleted(Map.of("SECTION_1", "accepted"))
            .build();

        // Invoke
        service.applySubmitPayload(requestTask, authUser);

        // Verify
        verify(empNotificationApplicationSubmitValidatorService)
            .validateEmpNotification(EmissionsMonitoringPlanNotificationContainer
                    .builder()
                    .emissionsMonitoringPlanNotification(taskPayload.getEmissionsMonitoringPlanNotification())
                    .build());
        verify(requestService)
                .addActionToRequest(request, actionPayload, MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_SUBMITTED,
                "user");
    }
}
