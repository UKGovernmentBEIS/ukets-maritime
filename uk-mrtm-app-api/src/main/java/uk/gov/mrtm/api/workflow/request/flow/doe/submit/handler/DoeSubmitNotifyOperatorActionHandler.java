package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeSubmitOutcome;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.service.RequestDoeApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.utils.DateUtils;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.NotifyOperatorForDecisionRequestTaskActionPayload;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DoeSubmitNotifyOperatorActionHandler implements
        RequestTaskActionHandler<NotifyOperatorForDecisionRequestTaskActionPayload> {
    private final RequestTaskService requestTaskService;
    private final RequestDoeApplyService doeApplyService;
    private final WorkflowService workflowService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      NotifyOperatorForDecisionRequestTaskActionPayload payload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        requestTask.getRequest().setSubmissionDate(LocalDateTime.now());

        doeApplyService.applySubmitNotify(requestTask, payload.getDecisionNotification(), appUser);

        workflowService.completeTask(requestTask.getProcessTaskId(), buildTaskVariables(requestTask));

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.DOE_SUBMIT_NOTIFY_OPERATOR);
    }

    private Map<String, Object> buildTaskVariables(final RequestTask requestTask) {
        Doe doe = ((DoeApplicationSubmitRequestTaskPayload) requestTask.getPayload()).getDoe();
        Map<String, Object> taskVariables = new HashMap<>();
        taskVariables.put(BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId());
        taskVariables.put(MrtmBpmnProcessConstants.DOE_SUBMIT_OUTCOME, DoeSubmitOutcome.SUBMITTED);
        taskVariables.put(MrtmBpmnProcessConstants.DOE_IS_PAYMENT_REQUIRED, doe.getMaritimeEmissions().getChargeOperator());
        if(doe.getMaritimeEmissions().getChargeOperator()) {
            final Date paymentExpirationDate = DateUtils.atEndOfDay(doe.getMaritimeEmissions().getFeeDetails().getDueDate());
            taskVariables.put(BpmnProcessConstants.PAYMENT_EXPIRATION_DATE, paymentExpirationDate);
        }
        return taskVariables;
    }

}