package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator.requesttaskaction;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskActionEligibilityEvaluator;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionTypes;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileStatus;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EmpVariationApplicationWaitForPeerReviewEvaluator implements RequestTaskActionEligibilityEvaluator<EmpVariationApplicationReviewRequestTaskPayload> {

    @Override
    public boolean isEligible(EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload) {
        return requestTaskPayload.getPreviewFiles().values().stream()
            .noneMatch(previewFile -> RequestTaskPreviewFileStatus.IN_PROGRESS.equals(previewFile.getStatus()));
    }

    @Override
    public String getRequestTaskType() {
        return MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_PEER_REVIEW;
    }

    @Override
    public List<String> getRequestTaskActionTypes() {
        return List.of(RequestTaskActionTypes.RDE_SUBMIT,
            MrtmRequestTaskActionType.RDE_SAVE);
    }
}
