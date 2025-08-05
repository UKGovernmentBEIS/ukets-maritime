package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.EmissionsMonitoringPlanFactory;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationAmendsSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.RequestEmpReviewService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceSubmitApplicationAmendActionHandlerTest {

    @InjectMocks
    private EmpIssuanceSubmitApplicationAmendActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestEmpReviewService requestEmpReviewService;

    @Mock
    private EmpValidatorService empValidatorService;

    @Mock
    private RequestService requestService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        Long accountId = 2L;
        Map<UUID, String> empAttachments = Map.of(UUID.randomUUID(), "test file name");
        Map<UUID, String> empAttachments2 = Map.of(UUID.randomUUID(), "test file name 2");
        Map<String, String> empSectionsCompleted = Map.of("key", "value");
        EmissionsMonitoringPlan emissionsMonitoringPlan =
            EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(UUID.randomUUID(), "1234567");

        EmpIssuanceApplicationAmendsSubmitRequestTaskPayload taskPayload =
            EmpIssuanceApplicationAmendsSubmitRequestTaskPayload.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empAttachments(empAttachments)
                .build();
        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder()
            .empAttachments(empAttachments)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build();

        EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder()
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .empSectionsCompleted(empSectionsCompleted)
            .empAttachments(empAttachments2)
            .build();

        EmpIssuanceApplicationAmendsSubmittedRequestActionPayload requestActionPayload =
            EmpIssuanceApplicationAmendsSubmittedRequestActionPayload.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empSectionsCompleted(empSectionsCompleted)
                .payloadType(MrtmRequestActionPayloadType.EMP_ISSUANCE_APPLICATION_AMENDS_SUBMITTED_PAYLOAD)
                .empAttachments(empAttachments2)
                .build();

        String processTaskId = "processTaskId";
        AppUser appUser = AppUser.builder().userId("user id").build();
        RequestTaskActionEmptyPayload taskActionPayload =
            RequestTaskActionEmptyPayload.builder()
                .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
                .build();
        Request request = Request.builder().payload(requestPayload).requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();
        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .payload(taskPayload)
            .request(request)
            .processTaskId(processTaskId)
            .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload = handler.process(requestTaskId,
            MrtmRequestTaskActionType.EMP_ISSUANCE_SUBMIT_APPLICATION_AMEND, appUser, taskActionPayload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(taskPayload);
        verify(requestTaskService).findTaskById(requestTaskId);
        verify(requestEmpReviewService).submitAmend(requestTask);
        verify(empValidatorService).validateEmissionsMonitoringPlan(empContainer, accountId);
        verify(requestService).addActionToRequest(request,
            requestActionPayload,
            MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_AMENDS_SUBMITTED,
            appUser.getUserId());
        verify(workflowService).completeTask(processTaskId);

        verifyNoMoreInteractions(requestTaskService, requestEmpReviewService,
            empValidatorService, requestService, workflowService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsOnly(MrtmRequestTaskActionType.EMP_ISSUANCE_SUBMIT_APPLICATION_AMEND);
    }
}