package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskActionEligibilityEvaluator;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EmpIssuanceReviewSendAccountOpeningEvaluator implements RequestTaskActionEligibilityEvaluator<EmpIssuanceApplicationReviewRequestTaskPayload> {

    @Override
    public boolean isEligible(EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload) {
        return !requestTaskPayload.isAccountOpeningEventSentToRegistry();
    }

    @Override
    public String getRequestTaskType() {
        return MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW;
    }

    @Override
    public List<String> getRequestTaskActionTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_ISSUANCE_SEND_REGISTRY_ACCOUNT_OPENING_EVENT);
    }
}
