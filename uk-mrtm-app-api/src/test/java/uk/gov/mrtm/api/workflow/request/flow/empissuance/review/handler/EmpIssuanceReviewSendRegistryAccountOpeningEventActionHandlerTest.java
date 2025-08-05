package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanIdentifierGenerator;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.EmissionsMonitoringPlanFactory;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.EmpIssuanceSendRegistryAccountOpeningAddRequestActionService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceReviewSendRegistryAccountOpeningEventActionHandlerTest {

    @InjectMocks
    private EmpIssuanceReviewSendRegistryAccountOpeningEventActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;
    @Mock
    private ApplicationEventPublisher publisher;
    @Mock
    private EmissionsMonitoringPlanIdentifierGenerator empIdentifierGenerator;
    @Mock
    private EmpIssuanceSendRegistryAccountOpeningAddRequestActionService addRequestActionService;

    @Test
    void process_isAccountOpeningEventSentToRegistry_false() {
        String userId = "user-id";
        AppUser appUser = AppUser.builder().userId(userId).build();
        long accountId = 2L;
        String empId = "UK-12345";
        Request request = Request.builder().id("id").requestResources(
            List.of(
                RequestResource.builder()
                    .resourceId(String.valueOf(accountId))
                    .resourceType(ResourceType.ACCOUNT)
                    .build())
            )
            .payload(EmpIssuanceRequestPayload.builder().accountOpeningEventSentToRegistry(true).build())
            .build();
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(UUID.randomUUID(), "1234567");
        RequestTaskPayload expectedRequestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .accountOpeningEventSentToRegistry(true)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build();

        RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .payload(EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .accountOpeningEventSentToRegistry(false)
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .build())
            .request(request)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);
        when(empIdentifierGenerator.generate(accountId)).thenReturn(empId);

        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_ISSUANCE_SEND_REGISTRY_ACCOUNT_OPENING_EVENT,
            appUser,
            RequestTaskActionEmptyPayload.builder().build());

        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verify(requestTaskService).findTaskById(requestTask.getId());
        verify(empIdentifierGenerator).generate(accountId);
        verify(addRequestActionService).addRequestAction(
            request,
            emissionsMonitoringPlan.getOperatorDetails().getOrganisationStructure(),
            userId);
        verify(publisher).publishEvent(EmpApprovedEvent.builder()
            .accountId(requestTask.getRequest().getAccountId())
            .empId(empId)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build());

        verifyNoMoreInteractions(publisher, requestTaskService, empIdentifierGenerator,
            addRequestActionService);
    }

    @Test
    void process_isAccountOpeningEventSentToRegistry_true() {
        AppUser appUser = AppUser.builder().build();
        Request request = Request.builder().id("id").build();
        RequestTaskPayload expectedRequestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .accountOpeningEventSentToRegistry(true)
            .build();

        RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .payload(expectedRequestTaskPayload)
            .request(request)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_ISSUANCE_SEND_REGISTRY_ACCOUNT_OPENING_EVENT,
            appUser,
            RequestTaskActionEmptyPayload.builder().build());

        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verify(requestTaskService).findTaskById(requestTask.getId());

        verifyNoMoreInteractions(requestTaskService);
        verifyNoInteractions(publisher, empIdentifierGenerator, addRequestActionService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.EMP_ISSUANCE_SEND_REGISTRY_ACCOUNT_OPENING_EVENT);
    }
}