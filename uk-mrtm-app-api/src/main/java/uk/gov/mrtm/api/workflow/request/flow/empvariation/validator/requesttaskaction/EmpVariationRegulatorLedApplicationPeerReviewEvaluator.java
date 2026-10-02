package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator.requesttaskaction;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskActionEligibilityEvaluator;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionTypes;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileStatus;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EmpVariationRegulatorLedApplicationPeerReviewEvaluator implements RequestTaskActionEligibilityEvaluator<EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload> {

    @Override
    public boolean isEligible(EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload requestTaskPayload) {
        return requestTaskPayload.getPreviewFiles().values().stream()
            .noneMatch(previewFile -> RequestTaskPreviewFileStatus.IN_PROGRESS.equals(previewFile.getStatus()));
    }

    @Override
    public String getRequestTaskType() {
        return MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW;
    }

    @Override
    public List<String> getRequestTaskActionTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_VARIATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION_REGULATOR_LED);
    }
}
