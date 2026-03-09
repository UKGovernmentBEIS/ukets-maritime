package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReason;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeFeeDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeSubmitOutcome;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.service.RequestDoeApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.utils.DateUtils;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.NotifyOperatorForDecisionRequestTaskActionPayload;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoeSubmitNotifyOperatorActionHandlerTest {

    @InjectMocks
    private DoeSubmitNotifyOperatorActionHandler service;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestDoeApplyService doeApplyService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process_with_Fee() {
        Long requestTaskId = 1L;
        String requestTaskActionType = MrtmRequestTaskActionType.DOE_SUBMIT_NOTIFY_OPERATOR;
        AppUser appUser = AppUser.builder().userId("user").build();
        NotifyOperatorForDecisionRequestTaskActionPayload payload = NotifyOperatorForDecisionRequestTaskActionPayload.builder()
            .payloadType(MrtmRequestTaskActionPayloadTypes.DOE_SUBMIT_NOTIFY_OPERATOR_PAYLOAD)
            .decisionNotification(DecisionNotification.builder()
                .signatory("signatory")
                .build())
            .build();
        Request request = Request.builder().id("2").build();

        UUID att1 = UUID.randomUUID();
        LocalDate dueDate = LocalDate.now().plusDays(1);
        Map<String, String> sectionsCompleted = Map.of("section1","true");
        Doe doe = Doe.builder().maritimeEmissions(
                    DoeMaritimeEmissions.builder().determinationReason(DoeDeterminationReason.builder()
                                .furtherDetails("furtherDetails")
                                .type(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT)
                                .build())
                            .chargeOperator(true)
                            .feeDetails(DoeFeeDetails.builder()
                                    .hourlyRate(BigDecimal.TEN)
                                    .totalBillableHours(BigDecimal.TEN)
                                    .dueDate(dueDate)
                                    .build())
                   .build())
                .build();
        DoeApplicationSubmitRequestTaskPayload taskPayload = DoeApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD)
            .doe(doe)
            .doeAttachments(Map.of(att1, "atta1.pdf"))
            .sectionsCompleted(sectionsCompleted)
            .build();

        RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .processTaskId("processTaskId")
            .payload(taskPayload)
            .request(request)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        DoeApplicationSubmitRequestTaskPayload payloadSaved =
                (DoeApplicationSubmitRequestTaskPayload)service.process(requestTaskId, requestTaskActionType,  appUser, payload);

        assertThat(request.getSubmissionDate()).isNotNull();

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(doeApplyService, times(1)).applySubmitNotify(requestTask, payload.getDecisionNotification(), appUser);
        verify(workflowService, times(1)).completeTask(requestTask.getProcessTaskId(),
            Map.of(BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId(),
                MrtmBpmnProcessConstants.DOE_SUBMIT_OUTCOME, DoeSubmitOutcome.SUBMITTED,
                    MrtmBpmnProcessConstants.DOE_IS_PAYMENT_REQUIRED, true,
                BpmnProcessConstants.PAYMENT_EXPIRATION_DATE, DateUtils.atEndOfDay(doe.getMaritimeEmissions().getFeeDetails().getDueDate())));
        assertThat(payloadSaved.getSectionsCompleted()).isEqualTo(sectionsCompleted);
    }

    @Test
    void process_without_Fee() {
        Long requestTaskId = 1L;
        String requestTaskActionType = MrtmRequestTaskActionType.DOE_SUBMIT_NOTIFY_OPERATOR;
        AppUser appUser = AppUser.builder().userId("user").build();
        NotifyOperatorForDecisionRequestTaskActionPayload payload = NotifyOperatorForDecisionRequestTaskActionPayload.builder()
            .payloadType(MrtmRequestTaskActionPayloadTypes.DOE_SUBMIT_NOTIFY_OPERATOR_PAYLOAD)
            .decisionNotification(DecisionNotification.builder()
                .signatory("signatory")
                .build())
            .build();
        Request request = Request.builder().id("2").build();

        Map<String, String> sectionsCompleted = Map.of("section1","true");
        UUID att1 = UUID.randomUUID();
        Doe doe = Doe.builder().maritimeEmissions(
                    DoeMaritimeEmissions.builder().determinationReason(DoeDeterminationReason.builder()
                                .type(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT)
                                .furtherDetails("furtherDetails")
                                .build())
                            .chargeOperator(false)
                    .build())
            .build();
        DoeApplicationSubmitRequestTaskPayload taskPayload = DoeApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD)
            .doe(doe)
            .doeAttachments(Map.of(att1, "atta1.pdf"))
            .sectionsCompleted(sectionsCompleted)
            .build();

        RequestTask requestTask = RequestTask.builder()
            .id(1L)
            .processTaskId("processTaskId")
            .payload(taskPayload)
            .request(request)
            .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        DoeApplicationSubmitRequestTaskPayload payloadSaved
                = (DoeApplicationSubmitRequestTaskPayload)service.process(requestTaskId, requestTaskActionType,  appUser, payload);

        assertThat(request.getSubmissionDate()).isNotNull();

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(doeApplyService, times(1)).applySubmitNotify(requestTask, payload.getDecisionNotification(), appUser);
        verify(workflowService, times(1)).completeTask(requestTask.getProcessTaskId(),
            Map.of(BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId(),
                MrtmBpmnProcessConstants.DOE_SUBMIT_OUTCOME, DoeSubmitOutcome.SUBMITTED,
                MrtmBpmnProcessConstants.DOE_IS_PAYMENT_REQUIRED, false));
        assertThat(payloadSaved.getSectionsCompleted()).isEqualTo(sectionsCompleted);
    }

    @Test
    void getTypes() {
        assertThat(service.getTypes()).containsExactly(MrtmRequestTaskActionType.DOE_SUBMIT_NOTIFY_OPERATOR);
    }
}
