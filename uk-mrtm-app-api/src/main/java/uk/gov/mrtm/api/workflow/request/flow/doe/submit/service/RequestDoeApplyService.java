package uk.gov.mrtm.api.workflow.request.flow.doe.submit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoeValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.validation.DecisionNotificationUsersValidator;

@Service
@RequiredArgsConstructor
public class RequestDoeApplyService {

    private final DoeValidatorService doeValidatorService;
    private final DecisionNotificationUsersValidator decisionNotificationUsersValidator;

    @Transactional
    public void applySaveAction(
            DoeSaveApplicationRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {
        DoeApplicationSubmitRequestTaskPayload taskPayload = (DoeApplicationSubmitRequestTaskPayload)requestTask.getPayload();
        taskPayload.setDoe(taskActionPayload.getDoe());
        taskPayload.setSectionsCompleted(taskActionPayload.getSectionsCompleted());
    }

    @Transactional
    public void applySubmitNotify(RequestTask requestTask, DecisionNotification decisionNotification, AppUser appUser) {
        final DoeApplicationSubmitRequestTaskPayload requestTaskPayload =
                (DoeApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        final Doe doe = requestTaskPayload.getDoe();

        doeValidatorService.validateDoe(doe);
        if(!decisionNotificationUsersValidator.areUsersValid(requestTask, decisionNotification, appUser)) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }

        final DoeRequestPayload requestPayload = (DoeRequestPayload) requestTask.getRequest().getPayload();

        requestPayload.setDecisionNotification(decisionNotification);
        updateRequestPayloadWithSubmitRequestTaskPayload(requestPayload, requestTaskPayload);
    }

    @Transactional
    public void requestPeerReview(RequestTask requestTask, String peerReviewer, String userId) {
        final DoeRequestPayload requestPayload = (DoeRequestPayload) requestTask.getRequest().getPayload();
        final DoeApplicationSubmitRequestTaskPayload requestTaskPayload =
                (DoeApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        requestPayload.setRegulatorPeerReviewer(peerReviewer);
        requestPayload.setRegulatorReviewer(userId);
        updateRequestPayloadWithSubmitRequestTaskPayload(requestPayload, requestTaskPayload);
    }

    private void updateRequestPayloadWithSubmitRequestTaskPayload(final DoeRequestPayload requestPayload,
                                                                  final DoeApplicationSubmitRequestTaskPayload requestTaskPayload) {
        final Doe doe = requestTaskPayload.getDoe();
        requestPayload.setDoe(doe);
        requestPayload.setSectionsCompleted(requestTaskPayload.getSectionsCompleted());
        requestPayload.setDoeAttachments(requestTaskPayload.getDoeAttachments());
    }
}
