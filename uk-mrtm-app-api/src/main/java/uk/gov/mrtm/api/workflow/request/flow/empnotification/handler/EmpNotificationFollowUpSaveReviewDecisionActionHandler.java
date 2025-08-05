package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Component
public class EmpNotificationFollowUpSaveReviewDecisionActionHandler implements RequestTaskActionHandler<EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload actionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        final EmpNotificationFollowUpApplicationReviewRequestTaskPayload taskPayload =
                (EmpNotificationFollowUpApplicationReviewRequestTaskPayload) requestTask.getPayload();

        // validate
        LocalDate dueDate = null;
        if (actionPayload.getReviewDecision().getType() == EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED) {
            dueDate = ((EmpNotificationFollowupRequiredChangesDecisionDetails) actionPayload.getReviewDecision().getDetails()).getDueDate();
        }
        if (dueDate != null && !dueDate.isAfter(taskPayload.getFollowUpResponseExpirationDate())) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }

        // update task payload
        taskPayload.setReviewDecision(actionPayload.getReviewDecision());
        taskPayload.setSectionsCompleted(actionPayload.getSectionsCompleted());

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_FOLLOW_UP_SAVE_REVIEW_DECISION);
    }
}
