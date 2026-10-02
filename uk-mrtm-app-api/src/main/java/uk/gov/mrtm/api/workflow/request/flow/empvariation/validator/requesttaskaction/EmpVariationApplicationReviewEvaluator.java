package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator.requesttaskaction;

import lombok.RequiredArgsConstructor;
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
public class EmpVariationApplicationReviewEvaluator implements RequestTaskActionEligibilityEvaluator<EmpVariationApplicationReviewRequestTaskPayload> {

    @Override
    public boolean isEligible(EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload) {
        return requestTaskPayload.getPreviewFiles().values().stream()
            .noneMatch(previewFile -> RequestTaskPreviewFileStatus.IN_PROGRESS.equals(previewFile.getStatus()));
    }

    @Override
    public String getRequestTaskType() {
        return MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW;
    }

    @Override
    public List<String> getRequestTaskActionTypes() {
        return List.of(
            RequestTaskActionTypes.RFI_SUBMIT,
            RequestTaskActionTypes.RFI_UPLOAD_ATTACHMENT,
            RequestTaskActionTypes.RDE_SUBMIT,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_APPLICATION_REVIEW,
            MrtmRequestTaskActionType.EMP_VARIATION_UPLOAD_SECTION_ATTACHMENT,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_REVIEW_GROUP_DECISION,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_DETAILS_REVIEW_GROUP_DECISION,
            MrtmRequestTaskActionType.EMP_VARIATION_UPLOAD_REVIEW_GROUP_DECISION_ATTACHMENT,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_REVIEW_DETERMINATION,
            MrtmRequestTaskActionType.EMP_VARIATION_NOTIFY_OPERATOR_FOR_DECISION,
            MrtmRequestTaskActionType.EMP_VARIATION_REQUEST_PEER_REVIEW,
            MrtmRequestTaskActionType.EMP_VARIATION_REVIEW_RETURN_FOR_AMENDS,
            MrtmRequestTaskActionType.RFI_SAVE,
            MrtmRequestTaskActionType.RDE_SAVE
        );
    }
}
