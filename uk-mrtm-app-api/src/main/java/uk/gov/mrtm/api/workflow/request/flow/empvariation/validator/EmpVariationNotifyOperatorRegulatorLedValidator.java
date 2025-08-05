package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.NotifyOperatorForDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.validation.DecisionNotificationUsersValidator;

@Service
@RequiredArgsConstructor
public class EmpVariationNotifyOperatorRegulatorLedValidator {

    private final EmpVariationRegulatorLedValidator empValidator;
    private final DecisionNotificationUsersValidator decisionNotificationUsersValidator;

    public void validate(RequestTask requestTask,
                         NotifyOperatorForDecisionRequestTaskActionPayload payload,
                         AppUser appUser) {
        final EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload taskPayload =
                (EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload) requestTask.getPayload();

        empValidator.validateEmp(taskPayload, requestTask.getRequest().getAccountId());
        empValidator.validateRegulatorLedReason(taskPayload.getReasonRegulatorLed());

        if (!decisionNotificationUsersValidator.areUsersValid(requestTask, payload.getDecisionNotification(), appUser)) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }
    }
}
