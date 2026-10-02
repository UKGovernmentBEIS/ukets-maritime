package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation.requesttaskaction;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskActionEligibilityEvaluator;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionTypes;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileStatus;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EmpIssuanceApplicationWaitForAmendsEvaluator implements RequestTaskActionEligibilityEvaluator<EmpIssuanceApplicationReviewRequestTaskPayload> {

    @Override
    public boolean isEligible(EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload) {
        return requestTaskPayload.getPreviewFiles().values().stream()
            .noneMatch(previewFile -> RequestTaskPreviewFileStatus.IN_PROGRESS.equals(previewFile.getStatus()));
    }

    @Override
    public String getRequestTaskType() {
        return MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS;
    }

    @Override
    public List<String> getRequestTaskActionTypes() {
        return List.of(RequestTaskActionTypes.RFI_SUBMIT,
            RequestTaskActionTypes.RFI_UPLOAD_ATTACHMENT,
            RequestTaskActionTypes.RDE_SUBMIT,
            MrtmRequestTaskActionType.EMP_ISSUANCE_RECALL_FROM_AMENDS,
            MrtmRequestTaskActionType.RFI_SAVE,
            MrtmRequestTaskActionType.RDE_SAVE);
    }
}
