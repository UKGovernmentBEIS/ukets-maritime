package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator.requesttaskaction;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskActionEligibilityEvaluator;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileStatus;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EmpVariationRegulatorLedApplicationSubmitEvaluator implements RequestTaskActionEligibilityEvaluator<EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload> {

    @Override
    public boolean isEligible(EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload requestTaskPayload) {
        return requestTaskPayload.getPreviewFiles().values().stream()
            .noneMatch(previewFile -> RequestTaskPreviewFileStatus.IN_PROGRESS.equals(previewFile.getStatus()));
    }

    @Override
    public String getRequestTaskType() {
        return MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT;
    }

    @Override
    public List<String> getRequestTaskActionTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_VARIATION_UPLOAD_SECTION_ATTACHMENT,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_APPLICATION_REGULATOR_LED,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_REVIEW_GROUP_DECISION_REGULATOR_LED,
            MrtmRequestTaskActionType.EMP_VARIATION_CANCEL_APPLICATION,
            MrtmRequestTaskActionType.EMP_VARIATION_REQUEST_PEER_REVIEW_REGULATOR_LED,
            MrtmRequestTaskActionType.EMP_VARIATION_NOTIFY_OPERATOR_FOR_DECISION_REGULATOR_LED
        );
    }
}
